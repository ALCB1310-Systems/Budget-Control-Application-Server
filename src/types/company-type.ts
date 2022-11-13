export type companyCreate = { ruc: string, name: string, employees: number, email: string, password: string, fullname: string }
export type companyResponse = { uuid: string, ruc: string, name: string, employees: number }
export type companyUpdate = { ruc: string, name: string, employees: number }