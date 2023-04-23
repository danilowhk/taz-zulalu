// pages/index.tsx
import Dexie from 'dexie';
import { GetServerSideProps } from "next";
import { useEffect } from "react";
import { EventsDTO } from "../types";
import HomeTemplate from "../templates/Home";


type Props = {
  events: EventsDTO[];
};

const Home = ({ events }: Props) => {
  const currentVersion = "1.2.0";
  const storageVersionKey = "myAppVersion";

  async function deleteAllIndexedDB() {
    try {
      const dbNames = await Dexie.getDatabaseNames();
      for (const dbName of dbNames) {
        await Dexie.delete(dbName);
      }
    } catch (error) {
      console.error('Error deleting IndexedDB databases:', error);
    }
  }

  function clearAllStorage() {
    // Clear LocalStorage
    localStorage.clear();
    // Clear SessionStorage
    sessionStorage.clear();
    window.indexedDB.deleteDatabase("workbox-expiration");
    window.indexedDB.deleteDatabase("workbox-expiration - https://zuzalu.city/");

    window.indexedDB.deleteDatabase("cache-entries");
    window.indexedDB.deleteDatabase("cacheName");
    window.indexedDB.deleteDatabase("timestamp");

    deleteAllIndexedDB();

  }
  

  function checkAndUpdateVersion() {
    const storedVersion = localStorage.getItem(storageVersionKey);
    if (storedVersion !== currentVersion) {
      clearAllStorage();
      localStorage.setItem(storageVersionKey, currentVersion);
    }
  }

  useEffect(() => {
    checkAndUpdateVersion();
  }, []);

  return <HomeTemplate events={events} />;
};

export default Home;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    const url = process.env.URL_TO_FETCH;

    const eventsResponse = await fetch(`${url}/api/fetchEvents`);
    const events = await eventsResponse.json();
    return {
      props: { events },
    };
  } catch (error) {
    res.statusCode = 404;
    return {
      props: {},
    };
  }
};
