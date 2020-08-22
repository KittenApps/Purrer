const idb = require("idb");

module.exports = {
  getIdb: () =>
    idb.openDB("Purrer", 1, {
      upgrade(db) {
        const store = db.createObjectStore("notifications", {
          keyPath: "id",
          autoIncrement: true
        });
        store.createIndex("channel", "channel", { unique: false });
        db.createObjectStore("settings", {keyPath: "id"});
      }
    }),
  defaultTheme: {
    primary: { main: "#043911" },
    secondary: { main: "#66d95e" },
    type: "dark"
  }
};
