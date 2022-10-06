export enum Callback {
    callback_url = "http://localhost:4200"
}

export enum Address {
    email_address = "john.doe@example.com",
    phone_number = "0712345678",
    country_code = "KE",
    first_name = "John",
    middle_name = "",
    last_name = "Doe",
    line_1 = "",
    line_2 = "",
    city = "Nairobi",
    state = "Nbi",
}

export interface MoneyOptons {
    name: string,
    value: string
}

export interface IForm {
    currency?: string,
    amount?: number,
    description?: any
}


