// index.mjs
import screenshot from "../../src/utils/chart/puppet"
import path from "path";
import {OUT_DIR} from "../../src/general/path";

screenshot({
  data: {
    columns: [
      ["data1", 300, 350, 300, 0, 0, 0],
      ["data2", 130, 100, 140, 200, 150, 50]
    ],
    types: {
      data1: "area-step",
      data2: "area-spline"
    }
  },

  // IMPORTANT:
  // Specify 'transition.duration=0' to avoid partial rendering
  // caused by the transition(animation).
  transition: {
    duration: 0
  }
}, path.join(OUT_DIR, "./chart01.png"));

screenshot({

  data: {
    columns: [
      ["data1", 300, 350, 300, 0, 0, 0],
      ["data2", 130, 100, 140, 200, 150, 50]
    ],
    types: {
      data1: "bar",
      data2: "area"
    }
  },
  transition: {
    duration: 0
  }
}, path.join(OUT_DIR, "./chart02.png"));