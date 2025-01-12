import { NextResponse } from "next/server";

export async function GET() {
  const data = [
    { id: 1, name: "API Item 1" },
    { id: 2, name: "API Item 2" },
  ];
  return NextResponse.json(data);
}
