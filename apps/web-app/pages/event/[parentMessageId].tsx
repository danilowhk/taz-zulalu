import { GetServerSideProps } from "next"

import axios from "axios"
import { EventsDTO, SessionsDTO } from "../../types"
import EventPage from "../../templates/EventPage"

type Props = {
    event: EventsDTO
    allSessions: SessionsDTO[]
    sessions: SessionsDTO[]
}

export default function Event({ event, sessions, allSessions }: Props) {
    return <EventPage event={event} sessions={sessions} allSessions={allSessions} />
}

export const getServerSideProps: GetServerSideProps = async ({ req, res, query }) => {
    try {
        const url = process.env.URL_TO_FETCH

        const eventResponse = await axios.post(
            `${url}/api/fetchEvents/${query.parentMessageId}`,
            {},
            {
                headers: {
                    "x-api-key": process.env.KEY_TO_API as string // Pass cookies from the incoming request
                }
            }
        )
        const event = await eventResponse.data

        const sessionsByEventResponse = await axios.get(`${url}/api/fetchSessionsByEvent/${query.parentMessageId}`, {
            headers: {
                Cookie: req.headers.cookie || "", // Pass cookies from the incoming request
                "x-api-key": process.env.KEY_TO_API as string // Pass cookies from the incoming request
            }
        })
        const sessions: SessionsDTO[] = await sessionsByEventResponse.data

        const allSessionsResponse = await axios.get(`${url}/api/fetchSessions`, {
            headers: {
                Cookie: req.headers.cookie || "", // Pass cookies from the incoming request
                "x-api-key": process.env.KEY_TO_API as string // Pass cookies from the incoming request
            }
        })

        const allSessions = await allSessionsResponse.data

        return {
            props: { event, allSessions, sessions }
        }
    } catch (error: any) {
        console.error("Error fetching sessions:", error.message)
        res.statusCode = 404
        return {
            props: {}
        }
    }
}
