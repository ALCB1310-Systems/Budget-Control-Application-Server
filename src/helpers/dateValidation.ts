import moment from "moment";

export const isValidDate = (dateString: string): boolean => {
	if (!moment(dateString, 'YYYY-MM-DD', true).isValid())
		return false
    
    return true
}