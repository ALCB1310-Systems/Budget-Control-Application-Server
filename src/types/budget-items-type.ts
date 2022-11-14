export type budgetItemCreate = {
    code: string,
    name: string,
    accumulates: boolean,
    level: number,
    parentUuid: string
}

export type budgetItemResponse = {
    uuid: string,
    code: string,
    name: string,
    accumulates: boolean,
    level: number,
    parentUuid: string | undefined | null
}
