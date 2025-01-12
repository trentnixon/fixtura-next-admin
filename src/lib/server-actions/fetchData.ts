"use server";

export async function fetchData() {
  const data = [
    { id: 1, name: "Item 1" },
    { id: 2, name: "Item 2" },
  ];
  return data;
}
