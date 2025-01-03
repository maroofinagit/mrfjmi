'use client'

import { useState, useEffect } from 'react';
import { Event } from './types';


import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"


import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';



const HomePage = () => {

  const [events, setEvents] = useState<Event[]>([]);
  const [newdata, setData] = useState<Event>({ eventName: '', date: "", time: "", location: { building: "", room: "", address: { street: "", zip: "", city: "" } }, organizer: { name: "", email: "", phone: "" } });

  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<keyof typeof events[0] | ''>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');


  // Fetch events from the JSON file
  useEffect(() => {
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    } else {

      fetch('/Data.json')
        .then((res) => res.json())
        .then((data) => setEvents(data.events));
    }
  }, []);

  const handleSort = (key: keyof typeof events[0]) => {
    setSortKey(key);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  // Filter and Sort Logic
  const filteredEvents = events
    .filter((event) =>
      event.eventName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortKey) return 0;

      const valueA = a[sortKey as keyof typeof a] as string;
      const valueB = b[sortKey as keyof typeof b] as string;

      return sortOrder === 'asc'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });

  const handleUpdate = () => {
  }

  const handleDelete = (e: Event) => {
    setEvents(events.filter((event) => event !== e));
  }

  const handleAdd = () => {

    setEvents([...events, newdata]);
    setData({ eventName: '', date: "", time: "", location: { building: "", room: "", address: { street: "", zip: "", city: "" } }, organizer: { name: "", email: "", phone: "" } })
  }


  return (
    <div className="container mx-auto space-y-4 px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Event Management</h1>

      {/* Search Input */}
      <div className="mb-4 flex justify-center">
        <input
          type="text"
          placeholder="Search by event name..."
          className="w-full max-w-md px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Sort Buttons */}
      <div className="mb-4 flex justify-center space-x-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => handleSort('eventName')}
        >
          Sort by Name {sortKey === 'eventName' && (sortOrder === 'asc' ? '↓' : '↑')}
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => handleSort('date')}
        >
          Sort by Date {sortKey === 'date' && (sortOrder === 'asc' ? '↓' : '↑')}
        </button>
      </div>

      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-2 border-gray-500 px-4 py-2">Event Name</th>
            <th className="border border-2 border-gray-500 px-4 py-2">Date</th>
            <th className="border border-2 border-gray-500 px-4 py-2">Time</th>
            <th className="border border-2 border-gray-500 px-4 py-2">Location</th>
            <th className="border border-2 border-gray-500 px-4 py-2">Organizer</th>
            <th className="border border-2 border-gray-500 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>

          {filteredEvents.map((event, index) => (
            <tr key={index}>
              <td className="border border-2 border-gray-500 px-4 py-2">{event.eventName}</td>
              <td className="border border-2 border-gray-500 px-4 py-2">{event.date}</td>
              <td className="border border-2 border-gray-500 px-4 py-2">{event.time}</td>
              <td className="border border-2 border-gray-500 px-4 py-2">
                {event.location.building}, Room {event.location.room}, {event.location.address.city}
              </td>
              <td className="border border-2 border-gray-500 px-4 py-2">
                {event.organizer.name} ({event.organizer.email})
              </td>
              <td className="border border-2 border-gray-500 px-4 py-2">

                <Dialog>
                  <DialogTrigger className='rounded text-white mx-4 border-2 border-gray-500 px-2 py-1 bg-green-600'>Edit</DialogTrigger>
                  <DialogContent className=' max-h-screen overflow-x-scroll'>
                    <DialogHeader>
                      <DialogTitle>Edit event details</DialogTitle>
                      <DialogDescription />
                    </DialogHeader>

                    <Label htmlFor='name'>Event Name</Label>
                    <Input type='name' id='name' value={event.eventName} onChange={(e) => { event.eventName = e.target.value; setEvents([...events]) }} />

                    <Label htmlFor='date'>Date</Label>
                    <Input type='date' id='date' value={event.date} onChange={(e) => { event.date = e.target.value; setEvents([...events]) }} />

                    <Label htmlFor='time'>Time</Label>
                    <Input type='time' id='time' value={event.time} onChange={(e) => { event.time = e.target.value; setEvents([...events]) }} />

                    <Label htmlFor='street'>Street</Label>
                    <Input type='text' id='street' value={event.location.address.street} onChange={(e) => { event.location.address.street = e.target.value; setEvents([...events]) }} />

                    <Label htmlFor='city'>City</Label>
                    <Input type='text' id='city' value={event.location.address.city} onChange={(e) => { event.location.address.city = e.target.value; setEvents([...events]) }} />

                    <Label htmlFor='city'>ZIP</Label>
                    <Input type='text' id='city' value={event.location.address.zip} onChange={(e) => { event.location.address.zip = e.target.value; setEvents([...events]) }} />

                    <Label htmlFor='building'>Building</Label>
                    <Input type='text' id='building' value={event.location.building} onChange={(e) => { event.location.building = e.target.value; setEvents([...events]) }} />

                    <Label htmlFor='room'>Room</Label>
                    <Input type='text' id='room' value={event.location.room} onChange={(e) => { event.location.room = e.target.value; setEvents([...events]) }} />

                    <Label htmlFor='oName'>Organizer Name</Label>
                    <Input type='text' id='oName' value={event.organizer.name} onChange={(e) => { event.organizer.name = e.target.value; setEvents([...events]) }} />

                    <Label htmlFor='oEmail'>Organizer Email</Label>
                    <Input type='email' id='oEmail' value={event.organizer.email} onChange={(e) => { event.organizer.email = e.target.value; setEvents([...events]) }} />

                    <Label htmlFor='oPhone'>Organizer Phone</Label>
                    <Input type='text' id='oPhone' value={event.organizer.phone} onChange={(e) => { event.organizer.phone = e.target.value; setEvents([...events]) }} />

                    <DialogClose asChild>
                      <Button onClick={handleUpdate}>Update</Button>
                    </DialogClose>

                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger>
                    <div className="bg-red-500 text-white px-2 py-1 rounded">Delete</div>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you sure you want to delete ?</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently delete your event
                      </DialogDescription>
                    </DialogHeader>
                    <DialogClose asChild>
                      <Button onClick={() => handleDelete(event)}>Delete</Button>
                    </DialogClose>
                  </DialogContent>
                </Dialog>

              </td>
            </tr>
          ))}

        </tbody>
      </table>

      <div className=' flex flex-col space-y-4 p-8 items-center '>
        <h1> Add Events </h1>

        <div className=' flex space-x-6 flex-wrap space-y-8 items-center'>

          <div className=' space-y-2 '>
            <Label htmlFor='name'>Event Name</Label>
            <Input type='name' id='name' value={newdata.eventName} onChange={(e) => { newdata.eventName = e.target.value; setData({ ...newdata }) }} />
          </div>

          <div className=' space-y-2'>
            <Label htmlFor='date'>Date</Label>
            <Input type='date' id='date' value={newdata.date} onChange={(e) => { newdata.date = e.target.value; setData({ ...newdata }) }} />
          </div>

          <div className=' space-y-2'>
            <Label htmlFor='time'>Time</Label>
            <Input type='time' id='time' value={newdata.time} onChange={(e) => { newdata.time = e.target.value; setData({ ...newdata }) }} />
          </div>

          <div className=' space-y-2'>
            <Label htmlFor='building'>Building</Label>
            <Input type='text' id='building' value={newdata.location.building} onChange={(e) => { newdata.location.building = e.target.value; setData({ ...newdata }) }} />
          </div>

          <div className=' space-y-2'>
            <Label htmlFor='room'>Room</Label>
            <Input type='text' id='room' value={newdata.location.room} onChange={(e) => { newdata.location.room = e.target.value; setData({ ...newdata }) }} />
          </div>

          <div className=' space-y-2'>
            <Label htmlFor='street'>Street</Label>
            <Input type='text' id='street' value={newdata.location.address.street} onChange={(e) => { newdata.location.address.street = e.target.value; setData({ ...newdata }) }} />
          </div>

          <div className=' space-y-2'>
            <Label htmlFor='street'>Zip</Label>
            <Input type='text' id='zip' value={newdata.location.address.zip} onChange={(e) => { newdata.location.address.zip = e.target.value; setData({ ...newdata }) }} />
          </div>

          <div className=' space-y-2'>
            <Label htmlFor='oName'>Organizer Name</Label>
            <Input type='text' id='oName' value={newdata.organizer.name} onChange={(e) => { newdata.organizer.name = e.target.value; setData({ ...newdata }) }} />
          </div>

          <div className=' space-y-2'>
            <Label htmlFor='email'>Organizer Email</Label>
            <Input type='text' id='email' value={newdata.organizer.email} onChange={(e) => { newdata.organizer.email = e.target.value; setData({ ...newdata }) }} />
          </div>

          <div className=' space-y-2'>
            <Label htmlFor='phone'>Organizer Phone</Label>
            <Input type='text' id='phone' value={newdata.eventName} onChange={(e) => { newdata.organizer.phone = e.target.value; setData({ ...newdata }) }} />
          </div>

        </div>

        <Button onClick={() => handleAdd()}>Add</Button>

      </div>

    </div>
  );
};

export default HomePage;
