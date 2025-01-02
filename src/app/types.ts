export interface Address {
    street: string;
    city: string;
    zip: string;
  }
  
  export interface Location {
    building: string;
    room: string;
    address: Address;
  }
  
  export interface Organizer {
    name: string;
    email: string;
    phone: string;
  }
  
  export interface Event {
    eventName: string;
    date: string;
    time: string;
    location: Location;
    organizer: Organizer;
  }
  