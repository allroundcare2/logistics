export enum EuserType {
    DRIVER = 'driver',
    SHOPPER = 'shopper'
}

export enum EvehicleType {
    BIKE = 'bike'
}
export interface Ivehicle {
    id?: number;
    vehicle_manufacturer?: string;
    vehicle_type?: string;
    license_plate?: string;
    rider_permit?: string;
    driver_id?: string;
}

export interface Idriver{
    driver_id?: number;
    card_type?: string;
    id_number?: string;
    issue_date?: Date | string;
    account_number?: string;
    bank_name?: string;
    card_image?: string;
}
export interface Iuser {
    first_name?: string;
    last_name?: string;
    email?: string;
    password?: string;
    phone?: string;
    id?: number;
    token?: string;
    DOB?: Date | string;
    type?: EuserType;
    profile_pics?: string;
    vehicle?: Ivehicle;
    driver?: Idriver;
}
export interface Iprice {
    price_name?: string;
    amount?: number;
    quantity?: number;
  }
  export interface Iproduct {
    _id?: any;
    product_image?: string;
    product_name?: string;
    createdAt?: Date | string;
    createdBy?: number;
    publicId?: string;
    prices: Iprice[];
  }
  export enum EorderStatus {
    CREATED = "created",
    APPROVED = 'approved',
    DELIVERY = 'ready for delivery',
    DISPATCHER_ACCEPT = 'accepted by dispatch rider',
    GOTO_SHOPPER = 'go to shopper',
    GOTO_RETAILER = 'go to retailer'
}
export interface IorderStatus {
    name?: EorderStatus,
    addedDate?: Date
}
export interface Ilocation {
    latitude: number;
    longitude: number;
}
export interface Iorder {
    _id?: any;
    dispatcher_id?: number;
    shopper_id?: number;
    shopper?: Iuser;
    retailer?: Iuser;
    admin_id?: number;
    shopper_address?: string;
    current_status?: string;
    retailer_address?: string;
    products?: Iproduct[];
    distance?: number; // in km
    shopper_location?:Ilocation;
    retailer_location?: Ilocation;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    retailer_id?: number;
    status?: IorderStatus[];
}

