import * as admin from 'firebase-admin';

let app: admin.app.App | undefined = undefined;

export function getFirebaseAdmin() {
  if (app) {
    return {
      auth: admin.auth(app),
      firestore: admin.firestore(app),
    };
  }

  try {
    app = admin.initializeApp();
  } catch (e) {
    // This can happen in dev mode.
    if (!/already exists/u.test((e as Error).message)) {
      console.error('Firebase admin initialization error', e);
    }
    app = admin.app();
  }

  return {
    auth: admin.auth(app),
    firestore: admin.firestore(app),
  };
}
