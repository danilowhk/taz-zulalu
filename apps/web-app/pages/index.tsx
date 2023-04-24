// pages/index.tsx
import { GetServerSideProps } from "next"
import Dexie from "dexie"
import axios from "axios"
import { useEffect } from "react"
import { EventsDTO } from "../types"
import HomeTemplate from "../templates/Home"

type Props = {
    events: EventsDTO[]
}

const Home = ({ events }: Props) => {
    const currentVersion = "1.3.0"
    const storageVersionKey = "myAppVersion"

    async function deleteAllCacheStorage() {
        const cacheNames = await caches.keys()
        await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)))
    }

    async function unregisterServiceWorkers() {
        const registrations = await navigator.serviceWorker.getRegistrations()
        await Promise.all(registrations.map((registration) => registration.unregister()))
    }

    async function deleteAllIndexedDB() {
        try {
            const dbNames = await Dexie.getDatabaseNames()
            for (const dbName of dbNames) {
                await Dexie.delete(dbName)
            }
        } catch (error) {
            console.error("Error deleting IndexedDB databases:", error)
        }
    }

    function deleteAllCookies() {
        document.cookie.split(";").forEach((c) => {
            document.cookie = c.replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`)
        })
    }

    function clearAllStorage() {
        // Clear LocalStorage
        localStorage.clear()
        // Clear SessionStorage
        sessionStorage.clear()
        // Clear all IndexedDB databases
        deleteAllIndexedDB()
        // Delete all cache storage
        deleteAllCacheStorage()
        // Unregister all service workers
        unregisterServiceWorkers()

        deleteAllCookies()
    }

    function checkAndUpdateVersion() {
        const storedVersion = localStorage.getItem(storageVersionKey)
        if (storedVersion !== currentVersion) {
            clearAllStorage()
            localStorage.setItem(storageVersionKey, currentVersion)
        }
    }

    useEffect(() => {
        checkAndUpdateVersion()
    }, [])

    return <HomeTemplate events={events} />
}

export default Home

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
    try {
        const url = process.env.URL_TO_FETCH

        const eventsResponse = await axios.post(
            `${url}/api/fetchEvents`,
            {},
            {
                headers: {
                    "x-api-key": process.env.KEY_TO_API as string // Pass cookies from the incoming request
                }
            }
        )
        const events = await eventsResponse.data
        return {
            props: { events }
        }
    } catch (error) {
        res.statusCode = 404
        return {
            props: {}
        }
    }
}
