import axios from '../utils/axios'

export default async function (
    setLabels, //лэйблы на карте
    setEdtree, //для обозначения секторов
    currentLoading_id, //дочерние элементы основывают набор лэйблов
    competence_id, //компетенция
    lowestLevel, //определение масштаба карты
    user_id, //пользователь
    date, //момент времени
    plan_id, //учебный план
    setRedFlags,
    setUpperInfo, //реакция на нажатия по элементам
    drawExternal, //отрисовка сквозной карты
    externalResults //результаты вне карты (отменяют competence_id, user_id, date)
) {
    let labels = []
    let redFlagsId = []
    let extObjects = []
    let disciplines = []
    setLabels(null)
    let edtreefull,
        edtree,
        results,
        profile,
        personal,
        discResults,
        inheritEdTree
    let currentLoadingName, aspectName, scaleType
    let externalConnectionsFrom = [] //внутри учебного курса
    let externalConnectionsTo = [] //внутри других учебных элементов
    let preferent_edelements = []
    if (!externalResults) {
        await axios
            .post(`/api/baskets/form-preference/results`, {
                user_id: user_id,
                date: date,
            })
            .then(({data}) => {
                personal = data
            })
        if (lowestLevel == 2)
            await axios
                .post(`/api/baskets/user`, {
                    user_id: user_id,
                    date: date,
                })
                .then(({data}) => {
                    discResults = data
                })
        else
            await axios
                .post(`/api/baskets/results`, {
                    user_id: user_id,
                    date: date,
                })
                .then(({data}) => {
                    results = data
                })
        //загрузка компетентностных профилей
        if (competence_id !== 0 && competence_id !== -1)
            await axios
                .post(`api/basket/profiles?`, {
                    //competence_id=${competence_id}&user_id=${user_id}&date=${date}&semester_id=${semester_id}
                    user_id: user_id,
                    date: date,
                    competence_id: competence_id,
                })
                .then(({data}) => {
                    profile = data
                })
        //загрузка целевых предпочтений из анкет обучающегося
        personal.map((elem) => {
            if (elem.answer.personal[0] != null) {
                if (elem.answer.personal[0].edelement_id != null) {
                    preferent_edelements.push(
                        elem.answer.personal[0].edelement_id
                    )
                    preferent_edelements.push(
                        elem.answer.personal[0].edelement.parent_id
                    )
                }
            }
        })
    } else {
        results = externalResults
    }
    if (lowestLevel == 2) scaleType = 'учебный план'
    if (lowestLevel == 3) scaleType = 'семестр'
    if (lowestLevel == 4) scaleType = 'дисциплина'
    //получение дерева образовательных элементов (весь учебный план)
    await axios
        .get(`/api/edelement/${plan_id}/children?edelement=true&level=5`, {})
        .then(({data}) => {
            edtreefull = data
            edtreefull.children_count = edtreefull.children.length
            let t = true
            let tree
            let objects = []
            objects.push(edtreefull)
            while (t) {
                let objstring = []
                tree = objects.find((elem) => elem.id == currentLoading_id)
                if (tree) t = false
                else
                    for (let i = 0; i < objects.length; i += 1)
                        if (objects[i].children_count > 0) {
                            for (
                                let j = 0;
                                j < objects[i].children_count;
                                j += 1
                            )
                                objstring.push(objects[i].children[j])
                        }

                objects = objstring
            }
            currentLoadingName = tree.name
            inheritEdTree = tree.children
            edtree = tree.children
        })
    //--------------------------------------------------------------
    let index = 0
    //-----------------------------------------------------
    if (edtree !== undefined) {
        for (let k = 0; k < 2; k = k + 1) {
            if (!drawExternal || lowestLevel != 4) k = 1
            for (let i = 0; i < edtree.length; i = i + 1) {
                for (let j = 0; j < edtree[i].children_count; j = j + 1) {
                    let object = edtree[i].children[j]

                    let id = object.id
                    if (drawExternal && lowestLevel == 4)
                        externalConnectionsTo.push(id)
                    let drawAnyCase = false
                    let prop = 0

                    let typeText = object.edelementtype.typeText
                    let sectorName = edtree[i].shortname
                    if (edtree[i].level == 3) sectorName = 't' + edtree[i].order
                    let type = 'rect'
                    let isBase = true
                    let numText, position
                    if (object.didacticdescription) {
                        numText = object.didacticdescription.packnumber
                        position = object.didacticdescription.packnumber
                        if (object.didacticdescription.importance < 50)
                            type = 'roundrect'
                        if (object.didacticdescription.importance < 30) {
                            {
                                type = 'circle'
                                if (
                                    !preferent_edelements.some(
                                        (elem_id) => elem_id == id
                                    )
                                ) {
                                    isBase = false
                                }
                            }
                        }
                    } else {
                        numText = edtree[i].order + '.' + object.order
                        position = object.order
                    }

                    let num = 1
                    let score = 0

                    let connections = []
                    let secStart = object.order === 1 ? true : false
                    let secEnd =
                        object.order === edtree[i].children_count ? true : false
                    let fontStyle = 'normal'
                    let arrowIn = false
                    let arrowOut = true
                    if (lowestLevel != 4 || (drawExternal && k == 1)) {
                        arrowIn = false
                        arrowOut = false
                        if (lowestLevel == 4) {
                            prop = i + 1
                            object.parent_id = edtree[i].id
                        }
                    }

                    if (
                        i == edtree.length - 1 &&
                        j == edtree[i].children_count - 1 &&
                        !drawExternal
                    ) {
                        ;(arrowIn = true), (arrowOut = false)
                    }
                    let level = lowestLevel - object.level
                    let isLabel = true
                    let secLength = 1
                    let lowLevel = []
                    let highLevel = []
                    let zeroScoreCount = 0
                    let scoreCount = 0
                    let percent = -1
                    let grey = false

                    for (let c = 0; c < object.connections.length; c = c + 1) {
                        if (!object.connections[c].external)
                            connections.push(
                                object.connections[c].edelement_to_id
                            )
                        else if (drawExternal && lowestLevel == 4) {
                            if (
                                !externalConnectionsFrom.some(
                                    (elem_id) =>
                                        elem_id ==
                                        object.connections[c].edelement_to_id
                                )
                            )
                                externalConnectionsFrom.push(
                                    object.connections[c].edelement_to_id
                                )

                            connections.push(
                                object.connections[c].edelement_to_id
                            )
                        }
                    }
                    if (object.level != lowestLevel)
                        for (
                            let ch = 0;
                            ch < object.children_count;
                            ch = ch + 1
                        ) {
                            lowLevel.push(object.children[ch].id)
                        }
                    if (object.quests.length == 0) grey = true

                    if (!profile) {
                        let scorable = false
                        for (let q = 0; q < object.quests.length; q = q + 1) {
                            let scores = null

                            scores = results.filter(
                                (res) => res.quest_id === object.quests[q].id
                            )
                            if (scores != null) {
                                scorable = true
                                scoreCount += scores.length
                                for (let s = 0; s < scores.length; s = s + 1) {
                                    score += scores[s].answer.value
                                    if (scores[s].answer.value == 0) score -= 1
                                    //zeroScoreCount += 1
                                    if (scores[s].answer.prime == 1)
                                        score += 0.5
                                }
                            }
                        }
                    }
                    if (competence_id == -1) {
                        if (
                            !preferent_edelements.some(
                                (elem_id) => elem_id == id
                            )
                        ) {
                            grey = true
                        }
                    }
                    if (profile) {
                        let scorable = false
                        for (let q = 0; q < object.quests.length; q = q + 1) {
                            let scores = null

                            scores = profile.filter(
                                (res) => res.quest_id === object.quests[q].id
                            )
                            if (scores != null) {
                                scorable = true
                                scoreCount += scores.length
                                for (let s = 0; s < scores.length; s = s + 1) {
                                    score += scores[s].value
                                    if (scores[s].value == 0)
                                        zeroScoreCount += 1
                                }
                            }
                        }
                    }

                    score = score / object.quests.length

                    if (score > 1) score = 1
                    if (score < -1) score = -1
                    percent = 50 + 50 * score
                    if (discResults !== undefined) {
                        let discResult = discResults.find(
                            (basket) =>
                                basket.test.discipline_id ==
                                object.discipline_id
                        )
                        if (discResult != undefined) {
                            drawAnyCase = true
                            grey = false
                            percent = discResult.score
                            if (discResult.score <= 65)
                                score = (5 * discResult.score) / 100 - 3.25
                            if (discResult.score > 65)
                                score =
                                    ((20 / 7) * discResult.score) / 100 - 13 / 7
                            //score = (2 * discResult.score) / 100 - 1
                        }
                    }
                    if (score < 0) redFlagsId.push(object.id)

                    highLevel.push(object.parent_id)
                    labels.push({
                        id: id,
                        index: index,
                        prop: prop,
                        typeText: typeText,
                        numText: numText,
                        type: type,
                        num: num,
                        score: score,
                        isBase: isBase,
                        connections: connections,
                        secStart: secStart,
                        secEnd: secEnd,
                        fontStyle: fontStyle,
                        arrowOut: arrowOut,
                        arrowIn: arrowIn,
                        level: level,
                        isLabel: isLabel,
                        secLength: secLength,
                        lowLevel: lowLevel,
                        highLevel: highLevel,
                        object: object,
                        position: position,
                        grey: grey,
                        percent: percent,
                        sectorName: sectorName,
                        drawAnyCase: drawAnyCase,
                    })
                    index += 1
                }
            }
            //**=========================================================================================== */
            //добавление сквозного характера карте (связей с внешними для дисциплины сущностями)
            if (drawExternal && lowestLevel == 4 && k != 1) {
                let t = true
                let objects = []
                objects.push(edtreefull)
                while (t) {
                    let objstring = []
                    for (let i = 0; i < objects.length; i += 1)
                        if (objects[i].children_count > 0) {
                            if (objects[i].level == 2)
                                disciplines.push(objects[i])
                            for (
                                let j = 0;
                                j < objects[i].children_count;
                                j += 1
                            ) {
                                if (
                                    objects[i].children[j].id !=
                                    currentLoading_id
                                ) {
                                    objstring.push(objects[i].children[j])
                                }
                            }
                        }
                    objects = objstring
                    if (objects[0].level == 4) t = false
                }
                objects.forEach((object) => {
                    if (
                        externalConnectionsFrom.some(
                            (elem_id) => elem_id == object.id
                        )
                    ) {
                        let t = object
                        t.connections = []
                        extObjects.push(t)
                    }
                    if (object.connections.length > 0)
                        object.connections.forEach((connection) => {
                            if (connection.external)
                                if (
                                    externalConnectionsTo.some(
                                        (id) => id == connection.edelement_to_id
                                    )
                                )
                                    if (
                                        !externalConnectionsFrom.some(
                                            (elem_id) => elem_id == object.id
                                        )
                                    ) {
                                        externalConnectionsFrom.push(object.id)
                                        extObjects.push(object)
                                    }
                        })
                })
                extObjects.sort(
                    (a, b) =>
                        a.discipline_id - b.discipline_id ||
                        a.didacticdescription.packnumber -
                            b.didacticdescription.packnumber
                )
                extObjects.map((object, index) => {
                    if (object.connections.length > 0) {
                        let t = []
                        object.connections.forEach((connection) => {
                            if (
                                externalConnectionsTo.some(
                                    (id) => id == connection.edelement_to_id
                                )
                            )
                                t.push(connection)
                        })
                        object.connections = t
                        extObjects[index] = object
                    }
                })
                t = []
                disciplines.forEach((discipline) => {
                    discipline.children = []
                    discipline.children_count = 0
                    let extObjectsDiscipline = extObjects.filter(
                        (object) =>
                            object.discipline_id == discipline.discipline_id
                    )
                    extObjectsDiscipline.map((object, index) => {
                        let t = object
                        t.order = index + 1
                        extObjectsDiscipline[index] = t
                    })
                    discipline.children = extObjectsDiscipline
                    discipline.children_count = extObjectsDiscipline.length
                    if (discipline.children_count > 0) {
                        inheritEdTree.push(discipline)
                        t.push(discipline)
                    }
                })
                disciplines = t
                edtree = disciplines
            }
        }

        // Образовательная траектория для сквозного типа карты===========================================================================================
        if (drawExternal && lowestLevel == 4) {
            let index = 0
            for (let label of labels) {
                if (labels.length - 1 > index) {
                    if (labels[index].prop != labels[index + 1].prop) {
                        labels[index].arrowIn = true
                        labels[index].arrowOut = false
                        labels[index + 1].arrowIn = false
                        labels[index + 1].arrowOut = true
                    } else {
                        label.arrowIn = false
                        label.arrowOut = true
                    }
                } else if (labels.length - 1 == index) {
                    label.arrowIn = true
                    label.arrowOut = false
                }
                index++
            }
        }
        //**========================================================================================== */
        if (lowestLevel == 2 || lowestLevel == 3) {
            let index = 0
            for (let label of labels) {
                if (labels.length - 1 > index) {
                    if (labels[index].secEnd && labels[index + 1].secStart) {
                        labels[index].arrowIn = true
                        labels[index].arrowOut = false
                        labels[index + 1].arrowIn = false
                        labels[index + 1].arrowOut = true
                    } else {
                        label.arrowIn = false
                        label.arrowOut = true
                    }
                } else if (labels.length - 1 == index) {
                    label.arrowIn = true
                    label.arrowOut = false
                }
                index++
            }
        }
        //**========================================================================================== */
        setEdtree(inheritEdTree)
        setUpperInfo((prev) => ({
            ...prev,
            currentLoadingName: currentLoadingName,
            scaleType: scaleType,
        }))
        console.log(labels)
        setLabels(labels)
        setRedFlags(redFlagsId)
    }
}
