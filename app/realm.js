import * as Realm from "realm-web";

let realm = null;

export function getRealm() {
  if (realm) return Promise.resolve(realm);
  const app = new Realm.App({ id: "purrer-rwqdl", timeout: 1000 });
  const getUser = app.currentUser
    ? app.currentUser.refreshCustomData().then(() => app.currentUser)
    : app.logIn(Realm.Credentials.anonymous());

  return getUser.then(user => {
    realm = {
      user,
      subsColl: app.services
        .mongodb("mongodb-atlas")
        .db("purrer")
        .collection("subscriptions")
    };
    return realm;
  });
}
