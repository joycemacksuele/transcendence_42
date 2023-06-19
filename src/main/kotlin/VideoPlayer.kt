import csstype.*
import react.*
import emotion.react.css
import react.dom.html.ReactHTML.button
import react.dom.html.ReactHTML.div
import react.dom.html.ReactHTML.h3
import react.dom.html.ReactHTML.img

external interface VideoPlayerProps : Props {
    var video: Video
    var onWatchedButtonPressed: (Video) -> Unit
    var unwatchedVideo: Boolean
}

val VideoPlayer = FC<VideoPlayerProps> { props ->
    div {
        // The kotlin-emotion wrapper for the Emotion library (https://emotion.sh/docs/introduction) makes it
        // possible to specify CSS attributes – even dynamic ones – right alongside HTML with JavaScript.
        // i.e.: you can specify a css block inside HTML elements div and h3, where you can define the styles.
        // Conceptually, that makes it similar to CSS-in-JS – but for Kotlin.
        css {
//            backgroundColor = NamedColor.lightgreen
            position = Position.absolute
            top = 10.px
            right = 10.px
        }
        h3 {
            +"${props.video.speaker}: ${props.video.title}"
        }

        button {
            css {
                display = Display.block
                // With the help of Kotlin CSS DSL that make it possible to change styles dynamically, you can
                // change the color of the button using a basic Kotlin if expression:
                backgroundColor = if (props.unwatchedVideo) NamedColor.lightgreen else NamedColor.red
            }
            onClick = {
                props.onWatchedButtonPressed(props.video)
            }
            if (props.unwatchedVideo) {
                +"Mark as watched"
            } else {
                +"Mark as unwatched"
            }
        }

        // Adding the share buttons from ReactShare.kt
        div {
            css {
                position = Position.absolute
                top = 10.px
                right = 10.px
            }
            EmailShareButton {
                url = props.video.videoUrl
                EmailIcon {
                    size = 32
                    round = true
                }
            }
            TelegramShareButton {
                url = props.video.videoUrl
                TelegramIcon {
                    size = 32
                    round = true
                }
            }
        }

        ReactPlayer {
            url = props.video.videoUrl
            controls = true
        }
    }
}