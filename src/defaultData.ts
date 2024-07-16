import { SHADE_COLORS } from "./entities/color";
import { uid } from "./uid";
import { State, defaultState, INITIALIZATION_STEPS } from "./models/State";

export const mockData: State = {
  ...defaultState,
  creances: [
    {
      _tag: "Registerable.Registered",
      id: "1",
      name: "Test",
      date: new Date(),
      categories: [
        {
          id: uid(),
          _tag: "Registerable.Registered",
          color: SHADE_COLORS[0],
          date: new Date(),
          icon: "CAMERA",
          name: "Visite",
        },
        {
          id: uid(),
          _tag: "Registerable.Registered",
          color: SHADE_COLORS[1],
          date: new Date(),
          icon: "HOME",
          name: "Location",
        },
        {
          id: uid(),
          _tag: "Registerable.Registered",
          color: SHADE_COLORS[2],
          date: new Date(),
          icon: "CART",
          name: "Courses",
        },
        {
          id: uid(),
          _tag: "Registerable.Registered",
          color: SHADE_COLORS[3],
          date: new Date(),
          icon: "DINNER",
          name: "Restaurant",
        },
        {
          id: uid(),
          _tag: "Registerable.Registered",
          color: SHADE_COLORS[4],
          date: new Date(),
          icon: "FLAG",
          name: "Autre",
        },
      ],
      users: [
        {
          id: uid(),
          name: "User 1",
          color: SHADE_COLORS[0],
          defaultDistribution: 3,
          avatar: "",
          date: new Date(),
          _tag: "Registerable.Registered",
        },
        {
          id: uid(),
          name: "User 2",
          color: SHADE_COLORS[1],
          defaultDistribution: 4.5,
          avatar: "",
          date: new Date(),
          _tag: "Registerable.Registered",
        },
        {
          id: uid(),
          name: "User 3",
          color: SHADE_COLORS[2],
          defaultDistribution: 5,
          avatar: "",
          date: new Date(),
          _tag: "Registerable.Registered",
        },
        {
          id: uid(),
          name: "User 4",
          color: SHADE_COLORS[3],
          defaultDistribution: 3,
          avatar: "",
          date: new Date(),
          _tag: "Registerable.Registered",
        },
      ],
      expenses: [],
      initialization: INITIALIZATION_STEPS.INITITIALIZED,
    },
  ],
};
