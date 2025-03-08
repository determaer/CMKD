import axios from '../utils/axios'

let personalPreferenceLabels = [
    {
        id: -1,
        prop: 1,
        typeText: 'Ψ',
        numText: '1',
        type: 'rect',
        num: 1,
        score: 0,
        mtxPos: '',
        isBase: true,
        connections: [],
        secStart: true,
        secEnd: true,
        fontStyle: 'bold',
        arrowOut: false,
        arrowIn: false,
        level: 2,
        isLabel: false,
        secLength: 1,
        lowLevel: [-2],
        highLevel: [],
        object: {name: ''},
    },
    {
        id: -2,
        prop: 1,
        typeText: 'Ψ',
        numText: '1.1',
        type: 'rect',
        num: 1,
        score: 0,
        mtxPos: '',
        isBase: true,
        connections: [],
        secStart: true,
        secEnd: true,
        fontStyle: 'bold',
        arrowOut: false,
        arrowIn: false,
        level: 1,
        isLabel: false,
        secLength: 1,
        lowLevel: [-3],
        highLevel: [-1],
        object: {name: ''},
    },
    {
        id: -3,
        prop: 1,
        typeText: 'Ψ',
        numText: '6',
        type: 'rect',
        num: 1,
        score: 0,
        mtxPos: '',
        isBase: true,
        connections: [],
        secStart: true,
        secEnd: true,
        fontStyle: 'normal',
        arrowOut: false,
        arrowIn: false,
        level: 0,
        isLabel: true,
        secLength: 1,
        lowLevel: [],
        highLevel: [-2],
        object: {name: 'Цели в изучении дидактических единиц'},
    },
]

export default async function (
    setLabels, //лэйблы на карте
    setEdtree, //для обозначения секторов
    currentLoading_id,
    plan_id,
    setCompTree,
    user_id,
    date,
    setRedFlags
) {
    let cLevel = 3
    let eLevel = 3
    let labels = []
    let raw = []
    let idGray = []
    let redFlagsId = []
    let personal
    let preferent_edelements = []
    let personalScore = 0
    let personalCount = 0
    let competenceScores = []
    let disciplines = {}
    setLabels(null)
    let edtree, results, comptree, allcomp, edtreefull
    await axios
        .post(`/api/baskets/form-preference/results`, {
            user_id: user_id,
            date: date,
        })
        .then(({data}) => {
            personal = data
        })
    personal.map((elem) => {
        if (elem.answer.personal[0] != null) {
            if (elem.answer.personal[0].edelement_id != null) {
                preferent_edelements.push(elem.answer.personal[0].edelement_id)
                preferent_edelements.push(
                    elem.answer.personal[0].edelement.parent_id
                )
            }
        }
    })
    console.log(preferent_edelements)
    await axios
        .post(`/api/baskets/results`, {
            user_id: user_id,
            date: date,
        })
        .then(({data}) => {
            results = data
        })
    await axios
        .post(`/api/baskets/user`, {
            user_id: user_id,
            date: date,
        })
        .then(({data}) => {
            data.forEach((element) => {
                disciplines[element.test.discipline_id] = true
            })
        })
    console.log(disciplines[18])
    await axios
        .get(`/api/edelement/${plan_id}/children?summary=true&level=5`, {})
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
            setEdtree(tree.children)
            edtree = tree.children
        })
    await axios
        .get(`/api/competence/57/children?level=${cLevel}`, {})
        .then(({data}) => {
            setCompTree(data)
            comptree = data
            allcomp = data
        })
    // Обход дерева компетенций //---------------------------------------------------------------//
    let compLabels = []
    let newCompTree = []
    let currentCode = 'n/a'
    if (comptree !== undefined) {
        let comp = true
        while (comp) {
            newCompTree = []
            for (let i = 0; i < comptree.length; i = i + 1) {
                let object = comptree[i]
                let id = object.id
                let prop = 2
                let typeText = object.mapping
                let numText = ''
                let secStart = object.order === 1 ? true : false
                let secEnd = i == comptree.length - 1 ? true : false
                if (
                    i !== comptree.length - 1 &&
                    comptree[i].order > comptree[i + 1].order
                ) {
                    secEnd = true
                }
                let code = object.mapping.split('-')
                if (code.length > 1) {
                    typeText = code[0]
                    numText = code[1]
                } else {
                    secEnd = true
                }

                let type = 'rect'
                let num = 1
                let score = 0
                let isBase = true
                let connections = []

                let arrowIn = false
                let arrowOut = false

                let level = 3 - object.level
                let isLabel = level === 0 ? true : false
                let fontStyle = level === 0 ? 'normal' : 'bold'
                let secLength = object.children_count
                let lowLevel = []
                for (let ch = 0; ch < object.children_count; ch = ch + 1) {
                    lowLevel.push(object.children[ch].id)
                }
                let highLevel = object.parent_id
                let zeroScoreCount = 0
                let scoreCount = 0
                let percent = -1
                let grey = false
                compLabels.push({
                    id: id,
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
                    grey: grey,
                    percent: percent,
                })

                if (object.children_count != 0)
                    for (let j = 0; j < object.children_count; j += 1)
                        newCompTree.push(object.children[j])
            }
            comptree = newCompTree
            if (comptree.length == 0) comp = false
        }
    }
    // Обход учебного плана //---------------------------------------------------------------------//
    let eeLabels = []
    let uniqueCompetences = []
    let themeScores = []
    let themeScore = 0
    let themeScoreCount = 0
    let themePercent = 0
    let themeId = -1
    if (results !== undefined && edtree !== undefined) {
        let edelement = true
        while (edelement) {
            let newEdtree = []
            for (let i = 0; i < edtree.length; i = i + 1) {
                let object = edtree[i]

                if (
                    edtree[i].edelementtype_id == 5 &&
                    disciplines[object.discipline_id] != undefined
                ) {
                    //Дидактическая единица
                    if (
                        edtree[i].quests.length !== 0 &&
                        edtree[i].didacticdescription.importance > 25
                    ) {
                        //к дидактической единице привязаны вопросы, у неё умеренная важность, она принадлежит к ядерной составляющей курса
                        let id = object.id
                        let prop = 0
                        let typeText = object.edelementtype.typeText
                        let numText = object.didacticdescription.packnumber
                        let type = 'rect'
                        if (object.didacticdescription.importance < 50)
                            type = 'roundrect'
                        let num = 1
                        let score = 0
                        let isBase = true
                        let connections = []
                        let competences = []
                        let secStart = object.order === 1 ? true : false
                        let secEnd =
                            object.order === edtree[i].children_count
                                ? true
                                : false
                        let fontStyle = 'normal'
                        let arrowIn = false
                        let arrowOut = false

                        let level = 4 - object.level
                        let isLabel = true
                        let secLength = 1
                        let lowLevel = []
                        let highLevel = []
                        let zeroScoreCount = 0
                        let scoreCount = 0
                        let percent = -1
                        let grey = false
                        for (
                            let c = 0;
                            c < object.connections2.length;
                            c = c + 1
                        ) {
                            connections.push(
                                object.connections2[c].edelement_to_id
                            )
                        }

                        for (
                            let ch = 0;
                            ch < object.children_count;
                            ch = ch + 1
                        ) {
                            lowLevel.push(object.children[ch].id)
                        }

                        let scorable = false
                        for (let q = 0; q < object.quests.length; q = q + 1) {
                            let scores = null

                            scores = results.filter(
                                (res) => res.quest_id === object.quests[q].id
                            )
                            if (scores.length > 0) {
                                scorable = true
                                scoreCount += scores.length
                                for (let s = 0; s < scores.length; s = s + 1) {
                                    score += scores[s].answer.value
                                    if (scores[s].answer.value == 0)
                                        zeroScoreCount += 1
                                    // if (scores[s].answer.prime == 1)
                                    //     primeCount += 1
                                }
                            }
                        }
                        if (zeroScoreCount == 0)
                            score = score / object.quests.length
                        else {
                            if (score > 1) score = 1
                            if (score < -1) score = -1

                            if (
                                zeroScoreCount > 0 &&
                                zeroScoreCount !== scoreCount
                            )
                                score = score - zeroScoreCount / scoreCount
                            if (
                                zeroScoreCount > 0 &&
                                zeroScoreCount == scoreCount
                            )
                                score = -0.5 * zeroScoreCount

                            if (score > 1) score = 1
                            if (score < -1) score = -1
                        }
                        percent = 50 + 50 * score

                        highLevel.push(object.parent_id)
                        if (object.parent_id != themeId) {
                            if (themeId != -1) {
                                themeScores.push({
                                    id: themeId,
                                    score: themeScore,
                                    percent: themePercent,
                                    count: themeScoreCount,
                                })
                                themeId = object.parent_id
                                themePercent = 0
                                themeScore = 0
                                themeScoreCount = 0
                            } else {
                                themeId = object.parent_id
                            }
                        }
                        themeScore += score
                        themePercent += percent
                        themeScoreCount += 1
                        let pretendPP = false
                        if (
                            preferent_edelements.some(
                                (elem_id) => elem_id == id
                            )
                        ) {
                            pretendPP = true
                            personalPreferenceLabels[2].connections.push(id)
                        }

                        for (
                            let c = 0;
                            c < object.competences.length;
                            c = c + 1
                        ) {
                            if (
                                !uniqueCompetences.some(
                                    (item) => item == object.competences[c].id
                                )
                            ) {
                                uniqueCompetences.push(object.competences[c].id)
                            }
                            competenceScores.push({
                                id: object.competences[c].id,
                                score: score,
                            })
                            connections.push(object.competences[c].id)
                        }

                        if (score < 0) redFlagsId.push(object.id)
                        if (score < 0.6) {
                            if (pretendPP) {
                                personalScore += score
                                personalCount += 1
                            }
                            eeLabels.push({
                                id: id,
                                prop: prop,
                                typeText: typeText,
                                numText: numText,
                                type: type,
                                num: num,
                                score: score,
                                isBase: isBase,
                                connections: connections,
                                competences: competences,
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
                                grey: grey,
                                percent: percent,
                                learnt: true,
                            })
                        } else idGray.push(edtree[i].id)
                    } else {
                        //данная дидактическая единица не учитывается (нет связанных заданий в тесте)
                        idGray.push(edtree[i].id)
                    }
                } else if (disciplines[object.discipline_id] != undefined) {
                    //иные элементы учебного плана (тема, дисциплина)
                    let id = object.id
                    let prop = 0
                    let typeText =
                        object.edelementtype_id == 4
                            ? object.edelementtype.typeText
                            : ''
                    let numText =
                        object.edelementtype_id == 4
                            ? object.order
                            : object.shortname
                    let type = 'rect'
                    let num = 1
                    let score = 0
                    let isBase = true
                    let connections = []
                    let competences = []
                    let secStart = true
                    let secEnd = true
                    let fontStyle = 'bold'
                    let arrowIn = false
                    let arrowOut = false

                    let level = 4 - object.level
                    let isLabel = object.edelementtype_id == 4 ? true : false
                    let secLength = 0
                    let lowLevel = []
                    let highLevel = []
                    let zeroScoreCount = 0
                    let scoreCount = 0
                    let percent = -1
                    let grey = false

                    for (let ch = 0; ch < object.children_count; ch = ch + 1) {
                        lowLevel.push(object.children[ch].id)
                    }

                    highLevel.push(object.parent_id)

                    eeLabels.push({
                        id: id,
                        prop: prop,
                        typeText: typeText,
                        numText: numText,
                        type: type,
                        num: num,
                        score: score,
                        isBase: isBase,
                        connections: connections,
                        competences: competences,
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
                        grey: grey,
                        percent: percent,
                    })
                }
                if (object.children_count != 0)
                    for (let j = 0; j < object.children_count; j += 1)
                        newEdtree.push(object.children[j])
            }
            edtree = newEdtree
            if (edtree.length == 0) edelement = false
        }
        uniqueCompetences.sort((a, b) => a - b)
        labels = eeLabels
        //обработка лэйблов U, удаление лишних связей-------------------------------------------------------------------------- */
        let labels1 = []
        let idSector = -1
        let labelsZero = labels.filter((item) => {
            if (item.level === 0) return item
        })
        let otherLabels = labels.filter((item) => {
            if (item.level !== 0) return item
        })
        let length2 = 0
        let lengths = []
        console.log(labelsZero)
        labelsZero.map((label, index) => {
            length2 += 1
            let connections1 = label.connections
            let secStart = false
            let secEnd = false
            if (label.object.parent_id != idSector) {
                secStart = true
                length2 = 1
                idSector = label.object.parent_id
            }
            if (index != labelsZero.length - 1) {
                if (labelsZero[index + 1].object.parent_id != idSector) {
                    secEnd = true
                    lengths.push({
                        id: label.highLevel[0],
                        secLength: length2,
                    })
                }
            } else {
                secEnd = true

                lengths.push({
                    id: label.highLevel[0],
                    secLength: length2,
                })
            }
            connections1 = connections1.filter((item) => {
                if (!idGray.some((id) => id == item)) return item
            })

            if (labelsZero.length - 1 > index) {
                if (
                    labelsZero[index].object.discipline_id !=
                    labelsZero[index + 1].object.discipline_id
                ) {
                    labelsZero[index].arrowIn = true
                    labelsZero[index].arrowOut = false
                    labelsZero[index + 1].arrowIn = false
                    labelsZero[index + 1].arrowOut = true
                } else {
                    labelsZero[index].arrowIn = false
                    labelsZero[index].arrowOut = true
                }
            } else if (labelsZero.length - 1 == index) {
                labelsZero[index].arrowIn = true
                labelsZero[index].arrowOut = false
            }

            label = {
                ...label,
                index: index,
                connections: connections1,
                secEnd: secEnd,
                secStart: secStart,
            }
            labels1.push(label)
        })
        let otherLabels2 = []
        otherLabels.map((label) => {
            let secLength = 0
            let score = 0
            let percent = 0
            if (label.level == 2) {
                let t = lengths.map((item) => {
                    if (label.lowLevel.includes(item.id))
                        secLength += item.secLength
                })
            } else {
                let s = themeScores.find(({id}) => id == label.id)
                let t = lengths.find(({id}) => id == label.id)
                if (t != undefined) secLength = t.secLength
                if (s != undefined) {
                    score = s.score / s.count
                    percent = s.percent / s.count
                }
            }
            if (secLength != 0) {
                label = {
                    ...label,
                    secLength: secLength,
                    score: score,
                    percent: percent,
                }
                otherLabels2.push(label)
            }
        })

        labels1 = otherLabels2.concat(labels1)
        //**----------------------------------------------------------------------------------- */
        let compLabelsZero = compLabels.filter((item) => {
            if (
                item.level === 0 &&
                uniqueCompetences.some((id) => id === item.id)
            )
                return item
        })
        let otherCompLabels = compLabels.filter((item) => {
            if (item.level !== 0) return item
        })

        competenceScores.sort(function (a, b) {
            return a.id - b.id
        })

        idSector = -1
        length2 = 0
        lengths = []
        let newCompLabelsZero = []
        compLabelsZero.map((label, index) => {
            let compScores = competenceScores.filter(
                (score) => score.id == label.id
            )
            let compScore = 0
            let compCount = compScores.length
            compScores.forEach((score) => {
                compScore += score.score
            })
            compScore = compScore / compCount
            length2 += 1
            let secStart = false
            let secEnd = false
            if (label.object.parent_id != idSector) {
                secStart = true
                length2 = 1
                idSector = label.object.parent_id
            }
            if (index != compLabelsZero.length - 1) {
                if (compLabelsZero[index + 1].object.parent_id != idSector) {
                    secEnd = true
                    lengths.push({
                        id: label.highLevel,
                        secLength: length2,
                    })
                }
            } else {
                secEnd = true

                lengths.push({
                    id: label.highLevel,
                    secLength: length2,
                })
            }
            label = {
                ...label,
                secEnd: secEnd,
                secStart: secStart,
                score: compScore - 0.5,
            }
            newCompLabelsZero.push(label)
        })

        otherLabels2 = []
        otherCompLabels.map((label) => {
            let secLength = 0
            if (label.level == 2) {
                lengths.map((item) => {
                    if (label.lowLevel.includes(item.id))
                        secLength += item.secLength
                })
            } else {
                let t = lengths.find(({id}) => id == label.id)
                if (t != undefined) secLength = t.secLength
            }
            if (secLength != 0) {
                label = {...label, secLength: secLength}
                otherLabels2.push(label)
            }
        })
        personalPreferenceLabels[2].score = personalScore / personalCount
        labels1 = labels1
            .concat(otherLabels2)
            .concat(personalPreferenceLabels)
            .concat(newCompLabelsZero)

        labels1.sort(function (a, b) {
            if (b.level == a.level) {
                return a.prop - b.prop
            }
            return b.level - a.level
        })
        labels = []
        labels1.map((label, index) => {
            label = {
                ...label,
                index: index,
                learnt: true,
            }

            labels.push(label)
        })
        console.log(labels)
        setLabels(labels)
        setRedFlags(redFlagsId)
    }
}
