import axios from '../utils/axios'

export default async function (user_id, position, test_id) {
    let baskets = [] //неформатированный набор обрезанных тестов
    let targetBasket = [] //целевой набор ответов в один тест
    await axios
        .post(`/api/baskets/results/united`, {
            user_id: user_id,
            position: position,
            test_id: test_id,
        })
        .then(({data}) => {
            baskets = data
        })
    let quests = []
    for (let basket of baskets) {
        let currentQuests = []
        for (let result of basket.results) {
            //результат из более старого теста не должен перекрыть результат более нового
            if (!quests.some((id) => result.quest_id == id)) {
                //Целевой ответ из тестов
                targetBasket.push(result)
                currentQuests.push(result.quest_id)
            }
        }
        currentQuests = [...new Set(currentQuests)] //уникальные ид квестов
        quests = quests.concat(currentQuests)
    }
    return targetBasket
}
