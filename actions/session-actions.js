"use server";

import crypto from "crypto";
import { db } from "../lib/db";

export const createSession = async (token, userId) => {
  const sessionToken = token?.jti || crypto.randomBytes(16).toString("hex"); // You can use `jti` as session token if you want
  const expires = new Date(Date.now() + 3600 * 1000); // Session expiration time (1 hour)

  // Save the session in the database
  await db.session.create({
    data: {
      sessionToken,
      userId,
      expires,
    },
  });

  return sessionToken;
};

export const getActiveSessions = async (userId) => {
  const activeSessions = await db.session.findMany({
    where: {
      userId,
      expires: {
        gte: new Date(), // Only active sessions that have not expired
      },
    },
    include: {
      user: true,
    },
  });
  return activeSessions;
};

export const getAllSessions = async (userId) => {
  const allSessions = await db.session.findMany({
    where: {
      userId,
    },
    include: {
      user: true,
    },
  });
  return allSessions;
};

export const deleteExpiredSessions = async () => {
  await db.session.deleteMany({
    where: {
      expires: {
        lt: new Date(), // Only expired sessions
      },
    },
  });
};

export const deleteSession = async (sessionToken, userId) => {
  await db.session.deleteMany({
    where: {
      sessionToken,
      userId,
    },
  });
};
