export type BarSection = {
  name: string;
  value: number;
  color: string;
};

export type Bar = {
  name: string;
  data: BarSection[];
};

export const bars: Bar[] = [
  {
    name: "category1",
    data: [
      { name: "Emma", value: 2, color: "#FFB6B6" },
      { name: "Lia", value: 4, color: "#FFD6A5" },
      { name: "Olivia", value: 23, color: "#FDFFB6" },
    ],
  },
  {
    name: "category2",
    data: [
      { name: "Emma", value: 34, color: "#FFB6B6" },
      { name: "Lia", value: 12, color: "#FFD6A5" },
      { name: "Olivia", value: 7, color: "#FDFFB6" },
    ],
  },
  {
    name: "category3",
    data: [
      { name: "Emma", value: 29, color: "#FFB6B6" },
      { name: "Lia", value: 50, color: "#FFD6A5" },
      { name: "Olivia", value: 89, color: "#FDFFB6" },
    ],
  },
  {
    name: "category4",
    data: [
      { name: "Emma", value: 2, color: "#FFB6B6" },
      { name: "Lia", value: 15, color: "#FFD6A5" },
      { name: "Olivia", value: 67, color: "#FDFFB6" },
    ],
  },
  {
    name: "category5",
    data: [
      { name: "Emma", value: 2, color: "#F5A9B8" },
      { name: "Liam", value: 34, color: "#FFDBAB" },
      { name: "Olivia", value: 18, color: "#FFFACD" },
      { name: "Noah", value: 2, color: "#B4EEB4" },
      { name: "Ava", value: 12, color: "#9BC1BC" },
      { name: "Isabella", value: 59, color: "#CDB599" },
      { name: "Mia", value: 32, color: "#FFC0CB" },
      { name: "Charlotte", value: 5, color: "#F4E3B1" },
      { name: "Amelia", value: 34, color: "#D8BFD8" },
      { name: "Harper", value: 30, color: "#FFE4C4" },
      { name: "Evylyn", value: 89, color: "#D2B48C" },
      { name: "Benjamin", value: 5, color: "#B0C4DE" },
      { name: "Sophia", value: 18, color: "#FFDAB9" },
    ],
  },
  {
    name: "category6",
    data: [
      { name: "Emma", value: 4, color: "#CAFFBF" },
      { name: "Lia", value: 3, color: "#9BF6FF" },
      { name: "Olivia", value: 18, color: "#A0C4FF" },
    ],
  },
  {
    name: "category7",
    data: [
      { name: "Emma", value: 12, color: "#CAFFBF" },
      { name: "Lia", value: 3, color: "#9BF6FF" },
      { name: "Olivia", value: 18, color: "#A0C4FF" },
    ],
  },
  {
    name: "category8",
    data: [
      { name: "Emma", value: 12, color: "#CAFFBF" },
      { name: "Lia", value: 3, color: "#9BF6FF" },
      { name: "Olivia", value: 18, color: "#A0C4FF" },
    ],
  },
  {
    name: "category9",
    data: [
      { name: "Emma", value: 2, color: "#FFB6B6" },
      { name: "Lia", value: 15, color: "#FFD6A5" },
      { name: "Olivia", value: 67, color: "#FDFFB6" },
    ],
  },
];
