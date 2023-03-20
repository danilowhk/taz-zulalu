/* eslint-disable prefer-const */
import "react-autocomplete-input/dist/bundle.css"
import "react-datepicker/dist/react-datepicker.css"
import { useEffect, useRef, useState } from "react"
import DatePicker from "react-datepicker"
import axios from "axios"
import { UserDTO } from "../../types"

type NewSessionState = {
    name: string
    organizers: string[]
    startDate: Date
    endDate: Date
    startTime: string
    endTime: string
    location: string
    tags: string[]
    info: string
    eventId: number
}

type Props = {
    newSession: NewSessionState
    setNewSession: (newEvent: NewSessionState) => void
    setSteps: (steps: number) => void
}

const Step1 = ({ newSession, setNewSession, setSteps }: Props) => {
    const [organizer, setOrganizer] = useState("")
    const [tag, setTag] = useState("")
    const [rerender, setRerender] = useState(true)
    const [suggestions, setSuggestions] = useState<UserDTO[]>([])
    const [display, setDisplay] = useState(false)
    const wraperRef = useRef(null)
    const { endDate, endTime, info, location, name, organizers, startDate, startTime, tags } = newSession

    const handleAddOrganizer = (user: string) => {
        setNewSession({ ...newSession, organizers: [...newSession.organizers, user] })
        setOrganizer("")
        setDisplay(false)
    }

    const handleRemoveOrganizer = (index: number) => {
        organizers.splice(index, 1)
        setRerender(!rerender)
    }

    const handleAddTag = () => {
        setNewSession({ ...newSession, tags: [...newSession.tags, tag] })
        setTag("")
    }

    const handleRemoveTag = (index: number) => {
        tags.splice(index, 1)
        setRerender(!rerender)
    }

    const handleClickOutside = (event: any) => {
        const { current: wrap } = wraperRef
        if (wrap && !wrap.contains(event.target)) {
            setDisplay(false)
        }
    }

    const fetchUsers = async () => {
        await axios
            .get("/api/fetchUsers")
            .then((res) => {
                setSuggestions(res.data)
            })
            .catch((err) => console.log(err))
    }
    useEffect(() => {
        fetchUsers()
    }, [])

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside)

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const checkIfAnyOtherSuggestion =
        suggestions
            .filter((item) => !organizers.includes(item.userName))
            .filter(({ userName }) => userName.toLowerCase().indexOf(organizer.toLowerCase()) > -1).length !== 0

    return (
        <div className="flex flex-col w-full">
            <div className="flex flex-col gap-1 my-1 w-full">
                <label htmlFor="name">Event Name</label>
                <input
                    className="border border-2 p-1"
                    type="text"
                    id="name"
                    placeholder="event name"
                    value={name}
                    onChange={(e) => setNewSession({ ...newSession, name: e.target.value })}
                />
            </div>
            <div className="flex flex-col md:flex-row justify-start gap-4 my-2">
                <div className="flex flex-col w-full">
                    <label>Event Start</label>
                    <DatePicker
                        className="border border-2 p-1 w-full"
                        selected={startDate}
                        onChange={(date) => setNewSession({ ...newSession, startDate: date as Date })}
                    />
                </div>
                <div className="flex flex-col w-full">
                    <label htmlFor="startTime">Time</label>
                    <input
                        className="border border-2 p-1"
                        type="time"
                        id="startTime"
                        name="startTime"
                        value={startTime}
                        onChange={(e) => setNewSession({ ...newSession, startTime: e.target.value })}
                    />
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-start gap-4 my-2">
                <div className="flex flex-col w-full">
                    <label>Event End</label>
                    <DatePicker
                        className="border border-2 p-1 w-full"
                        selected={endDate}
                        onChange={(date) => setNewSession({ ...newSession, endDate: date as Date })}
                    />
                </div>
                <div className="flex flex-col w-full">
                    <label htmlFor="endTime">Time</label>
                    <input
                        className="border border-2 p-1"
                        type="time"
                        id="endTime"
                        name="endTime"
                        value={endTime}
                        onChange={(e) => setNewSession({ ...newSession, endTime: e.target.value })}
                    />
                </div>
            </div>
            <div className="flex flex-col gap-1 my-2">
                <label htmlFor="tags">Location</label>
                <input
                    className="border border-2 p-1"
                    type="text"
                    value={location}
                    id="location"
                    placeholder="location"
                    onChange={(e) => setNewSession({ ...newSession, location: e.target.value })}
                />
            </div>
            <div className="flex flex-col gap-1 my-2 w-full">
                <label htmlFor="tags">Organizers</label>
                <p className="text-xs font-weight: 100">Prefix @ with a name to search. Eg. @Vitalik</p>
                <div className="flex flex-col relative" ref={wraperRef}>
                    <div className="flex flex-row gap-4">
                        <input
                            id="organizers"
                            type="text"
                            className="border border-2 p-1 w-full"
                            placeholder="add organizer"
                            value={organizer}
                            onChange={(e) => setOrganizer(e.target.value)}
                            onClick={() => setDisplay(true)}
                        />
                    </div>
                    {display && (
                        <div className="border border-t-transparent bg-white flex flex-col absolute top-[35px] w-full z-10">
                            {checkIfAnyOtherSuggestion ? (
                                suggestions
                                    .filter((item) => !organizers.includes(item.userName))
                                    .filter(
                                        ({ userName }) => userName.toLowerCase().indexOf(organizer.toLowerCase()) > -1
                                    )
                                    .map((user, index) => (
                                        <div
                                            key={index}
                                            onClick={() => handleAddOrganizer(user.userName)}
                                            className="flex h-[50px] items-center px-2 uppercase hover:bg-black hover:text-white cursor-pointer transition duration-300 ease-in-out"
                                        >
                                            <span>{user.userName}</span>
                                        </div>
                                    ))
                            ) : (
                                <div className="flex h-[50px] items-center px-2 uppercase hover:bg-black hover:text-white cursor-pointer transition duration-300 ease-in-out">
                                    <span>No user found</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <ul className="flex flex-row items-start">
                    {organizers.map((item, index) => (
                        <li key={index} className="relative mx-1 bg-gray-200 p-1 rounded text-sm">
                            {item}
                            <button className="absolute top-0" onClick={() => handleRemoveOrganizer(index)}>
                                x
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="flex flex-col gap-1 my-2 w-full">
                <label htmlFor="tags">Tags</label>

                <div className="flex flex-row gap-4">
                    <input
                        id="tags"
                        type="text"
                        className="border border-2 p-1 w-full"
                        placeholder="add tag"
                        value={tag}
                        onChange={(e) => setTag(e.target.value)}
                    />

                    <button
                        className="lex flex-row font-[600] justify-center items-center py-[8px] px-[16px] gap-[8px] bg-[#35655F] rounded-[8px] text-white text-[16px]"
                        onClick={() => handleAddTag()}
                    >
                        Add
                    </button>
                </div>
                <ul className="flex flex-row items-start">
                    {newSession.tags.map((item, index) => (
                        <li key={index} className="relative mx-1 bg-gray-200 p-1 rounded text-sm">
                            {item}
                            <button className="absolute top-0" onClick={() => handleRemoveTag(index)}>
                                X
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="flex flex-col my-2">
                <label htmlFor="info">Additional Information</label>
                <textarea
                    className="border border-2 p-1 w-full"
                    placeholder="Additional info"
                    name="info"
                    id="info"
                    rows={5}
                    value={info}
                    onChange={(e) => setNewSession({ ...newSession, info: e.target.value })}
                />
            </div>
            <div className="w-full flex flex-col items-center">
                <button
                    type="button"
                    className="w-[200px] lex flex-row font-[600] justify-center items-center py-[8px] px-[16px] gap-[8px] bg-[#35655F] rounded-[8px] text-white text-[16px]"
                    onClick={() => setSteps(2)}
                >
                    Next Step
                </button>
            </div>
        </div>
    )
}

export default Step1
