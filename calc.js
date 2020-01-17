const urlParams = new URLSearchParams(window.location.search)
const scoreSequence = urlParams.get("sequence")

const calculateScore = frames => {
    let totalScore = 0

    //split input string into array of strings for each frame
    const framesArray = frames.split("-")

    //make array of objects for each frame
    const framesObjectArray = framesArray.map((frameThrows, i) => ({
            name: "frame " + [parseInt(i) + 1],
            throws: frameThrows.split(""),
            inFrameTotal: 0,
            bonusTotal: 0
        }))

    //find in frame total for each frame
    for (let i in framesObjectArray) {
        let frame = framesObjectArray[i]
        for (let j in frame.throws) {
            if (frame.throws[j] === "X") {
                frame.inFrameTotal += 10
            } else if (frame.throws[j] === "/") {
                //add the difference between 10 and the previous throw
                frame.inFrameTotal += 10 - parseInt(frame.throws[parseInt(j) - 1])
            } else {
                frame.inFrameTotal += parseInt(frame.throws[j])
            }
        }
    }

    //find bonus for each frame excluding tenth frame
    for (let i in framesObjectArray) {
        let frame = framesObjectArray[i]

        if (i === "9") { break }

        for (let j in frame.throws) {
            if (frame.throws[j] === "X") {
                const nextFrameThrows = framesObjectArray[parseInt(i) + 1].throws

                //if next frame has only one throw, it is a strike, add that and the following throw
                if (nextFrameThrows.length === 1) {
                    frame.bonusTotal += 10

                    const followingFrameFirstThrow = framesObjectArray[parseInt(i) + 2].throws[0]

                    frame.bonusTotal += followingFrameFirstThrow === "X" ? 10 : parseInt(followingFrameFirstThrow)
                } else {
                    //otherwise, add the first 2 throws of the next frame
                    const firstTwoThrows = nextFrameThrows.slice(0, 2)

                    firstTwoThrows.forEach(throwScore => {
                        if (throwScore === "X") {
                            frame.bonusTotal += 10
                        } else if (throwScore === "/") {
                            //add the difference between 10 and the previous throw
                            frame.bonusTotal += 10 - parseInt(firstTwoThrows[0])
                        } else {
                            frame.bonusTotal += parseInt(throwScore)
                        }
                    })
                }
            } else if (frame.throws[j] === "/") {
                const nextThrow = frame.throws[parseInt(j) + 1]
                //if the next throw exists, add that
                if (nextThrow) {
                    frame.bonusTotal += nextThrow === "X" ? 10 : parseInt(nextThrow)
                    //otherwise, add the first throw of the next frame
                } else {
                    nextFrameFirstThrow = framesObjectArray[parseInt(i) + 1].throws[0]
                    frame.bonusTotal += nextFrameFirstThrow === "X" ? 10 : parseInt(nextFrameFirstThrow)
                }
            }
        }
    }
    //total up the in frame total and bonus total of each frame to get total score for the game
    framesObjectArray.forEach(frame => totalScore += frame.inFrameTotal + frame.bonusTotal)

    $("#arrayDisplay").val(JSON.stringify(framesObjectArray, true, 2))

    return totalScore
}

$("#sequence").val(scoreSequence)

$("#scoreDisplay").html(calculateScore(scoreSequence))

if (!scoreSequence)
    $('<p class="text-muted" />').html("The calculated total score for the game will be displayed here when you submit the card above.")
