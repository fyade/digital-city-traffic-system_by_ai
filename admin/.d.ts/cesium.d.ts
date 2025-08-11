declare module 'cesium' {
  interface Timeline {
    makeLabel: (time: JulianDate) => string;
  }
}
