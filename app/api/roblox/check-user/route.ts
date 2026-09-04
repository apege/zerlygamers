import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { username } = await request.json();

    if (!username || typeof username !== "string" || !username.trim()) {
      return NextResponse.json(
        { success: false, message: "Silakan masukkan username Roblox." },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim();

    // 1. Fetch user data from official Roblox API with cache
    const userRes = await fetch("https://users.roblox.com/v1/usernames/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        usernames: [cleanUsername],
        excludeBannedUsers: false,
      }),
      next: { revalidate: 86400 }, // Cache on server for 24 hours
    });

    if (!userRes.ok) {
      return NextResponse.json(
        { success: false, message: "Gagal menghubungi server Roblox." },
        { status: userRes.status }
      );
    }

    const userData = await userRes.json();

    if (!userData.data || userData.data.length === 0) {
      return NextResponse.json(
        { success: false, message: `Username "${cleanUsername}" tidak ditemukan di Roblox!` },
        { status: 404 }
      );
    }

    const user = userData.data[0];

    // 2. Fetch avatar headshot thumbnail with cache
    let avatarUrl = "";
    try {
      const thumbRes = await fetch(
        `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${user.id}&size=150x150&format=Png&isCircular=true`,
        { next: { revalidate: 86400 } }
      );
      if (thumbRes.ok) {
        const thumbData = await thumbRes.json();
        if (thumbData.data && thumbData.data.length > 0) {
          avatarUrl = thumbData.data[0].imageUrl || "";
        }
      }
    } catch {
      // ignore thumbnail fetch failure fallback
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          displayName: user.displayName,
          avatarUrl,
        },
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
          "CDN-Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
          "Vercel-CDN-Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan saat memeriksa akun Roblox." },
      { status: 500 }
    );
  }
}
