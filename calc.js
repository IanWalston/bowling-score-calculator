//get sequence from url params
const urlParams = new URLSearchParams(window.location.search)
const scoreSequence = urlParams.get("sequence")

const calculateScore = frames => {
    //split input string into array of strings
    const framesArray = frames.split("-")

    //make array of objects from the array of strings
    const framesObjectArray = framesArray.map((frameThrows, i) => ({
            name: "frame " + [parseInt(i) + 1],
            throws: frameThrows.split(""),
            inFrameTotal: 0,
            bonusTotal: 0
        }))

    //for each frame
    for (let i in framesObjectArray) {
        let frame = framesObjectArray[i]
        //for each throw in the frame
        for (let j in frame.throws) {
            switch(frame.throws[j]){
                //if the throw is a strike
                case "X" :
                    //add 10
                    frame.inFrameTotal += 10

                    //if it's not the tenth frame
                    if (i != 9 ){
                        const nextFrameThrows = framesObjectArray[parseInt(i) + 1].throws

                        //if the next frame has only one throw, it is a strike, add that and the following frame's first throw
                        if (nextFrameThrows.length === 1) {
                            frame.bonusTotal += 10

                            const followingFrameFirstThrow = framesObjectArray[parseInt(i) + 2].throws[0]

                            frame.bonusTotal += followingFrameFirstThrow === "X" ? 10 : parseInt(followingFrameFirstThrow)
                        } else {
                            //otherwise, add the first 2 throws of the next frame
                            const firstTwoThrows = nextFrameThrows.slice(0, 2)

                            firstTwoThrows.forEach(throwScore => {
                                switch(throwScore) {
                                    case 'X':
                                        frame.bonusTotal += 10
                                        break
                                    case '/':
                                        // if one is a spare, add the difference between 10 and the previous throw
                                        frame.bonusTotal += 10 - parseInt(firstTwoThrows[0])
                                        break
                                    default: 
                                    frame.bonusTotal += parseInt(throwScore)
                                }
                            })
                        }
                    }
                    break
                case "/":
                    //if its a spare, add the difference between 10 and the previous throw
                    frame.inFrameTotal += 10 - parseInt(frame.throws[parseInt(j) - 1])

                    //if it's not the tenth frame
                    if (i != 9){
                        //add the value of the next frame's first throw
                        nextFrameFirstThrow = framesObjectArray[parseInt(i) + 1].throws[0]
                        frame.bonusTotal += nextFrameFirstThrow === "X" ? 10 : parseInt(nextFrameFirstThrow)
                    }
                    break
                default:
                    //if it's a number, add it to the total
                    frame.inFrameTotal += parseInt(frame.throws[j])
            }
        }
    }
    //debugging: console.log(framesObjectArray)

    //total up the in-frame total and bonus total of each frame to get total score for the game
    return framesObjectArray.map(frame => frame.inFrameTotal + frame.bonusTotal).reduce((a, b) => a + b )
}

$("#sequence").val(scoreSequence)

const totalScore = calculateScore(scoreSequence)

$("#scoreDisplay").html(totalScore)

$('#scoreDisplay').addClass( totalScore > 299 && "text-danger" )

//tests
console.log(
    calculateScore( 'X-X-X-X-X-X-X-X-X-XXX' ) === 300 ,
    calculateScore( '45-54-36-27-09-63-81-18-90-72' ) === 90 ,
    calculateScore( '5/-5/-5/-5/-5/-5/-5/-5/-5/-5/5' ) === 150 ,
    calculateScore( '8/-54-90-X-X-5/-53-63-9/-9/X' ) === 149 ,
    calculateScore( '14-45-6/-5/-X-01-7/-6/-X-2/6' ) === 133 ,
    calculateScore( '9/-0/-X-X-62-7/-8/-X-90-9/X' ) === 168 ,
    calculateScore( '9/-0/-X-X-62-7/-8/-X-90-X9/' ) === 168 )
