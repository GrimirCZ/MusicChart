import { Rating } from "../types/rating.type";

export const computeScore = (rating: Rating[]) => {
    return rating.reduce((prev, cur) => prev + cur.value, 0) / rating.filter(rating => rating.value !== 0).length
}
