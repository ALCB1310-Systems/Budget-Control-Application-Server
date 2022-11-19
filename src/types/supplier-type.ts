export type supplierCreate = {
    supplier_id: string,
    name: string,
    contact_name: string,
    contact_email: string,
    contact_phone: string
}

export type supplierResponse = {
    uuid: string,
    supplier_id: string,
    name: string,
    contact_name: string|null,
    contact_email: string|null,
    contact_phone: string|null
}