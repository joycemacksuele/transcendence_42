import kotlinx.coroutines.async
import react.*
import react.dom.*
import kotlinx.browser.window
import kotlinx.coroutines.*
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.json.Json
import emotion.react.css
import csstype.Position
import csstype.px
import kotlinx.browser.document
import react.dom.client.createRoot
import react.dom.html.ReactHTML.h1
import react.dom.html.ReactHTML.h3
import react.dom.html.ReactHTML.div
import react.dom.html.ReactHTML.p
import react.dom.html.ReactHTML.img

// Kotlin has specific data classes
data class Video(
    val id: Int,
    val title: String,
    val speaker: String,
    val videoUrl: String
)

// Components
// The basic building blocks in React are called components. Components themselves can also be composed of other,
// smaller components. By combining components, you build your application. If you structure components to be
// generic and reusable, you'll be able to use them in multiple parts of the app without duplicating code or logic.
// i.e.: Components encapsulate a particular functionality to shorten source code and make it easier to read/understand.

//The FC function creates a function component:
val App = FC<Props> {

    // State is one of core concepts in React. In modern React (which uses the so-called Hooks API),
    // state is expressed using the useState hook (https://legacy.reactjs.org/docs/hooks-state.html):
    var currentVideo: Video? by useState(null)
    // The by keyword indicates that useState() acts as a delegated property (from React).
    // The useState() function from React instructs the framework to keep track of state across multiple invocations
    // of the function. For example, even though you specify a default value, React makes sure that the default
    // value is only assigned in the beginning. When state changes, the component will re-render based on the new state.

    // Since these lists can actually change, they have to be in the application state (i.e.: in the App component, and having a state):
    var unwatchedVideos: List<Video> by useState(listOf(
        Video(1, "Opening Keynote", "Andrey Breslav", "https://youtu.be/PsaFVLr8t4E"),
        Video(2, "Dissecting the stdlib", "Huyen Tue Dao", "https://youtu.be/Fzt_9I733Yg"),
        Video(3, "Kotlin and Spring Boot", "Nicolas Frankel", "https://youtu.be/pSiZVAeReeg")
    ))
    var watchedVideos: List<Video> by useState(listOf(
        Video(4, "Creating Internal DSLs in Kotlin", "Venkat Subramaniam", "https://youtu.be/JzTeAM8N1-o")
    ))

    val container = document.getElementById("root") ?: error("Couldn't find root container!")
    // The render() function instructs kotlin-react-dom to render the first HTML element inside a fragment
    // to the root element. This element is a container defined in src/main/resources/index.html, which
    // was included in the template:
    createRoot(container).render(Fragment.create {

        // The Kotlin wrappers for React come with a domain-specific language (DSL) that makes it possible to
        // write HTML in pure Kotlin code. In this way, it's similar to JSX from JavaScript.
        // However, with this markup being Kotlin, you get all the benefits of a statically typed language,
        // such as autocomplete or type checking, loops, conditions, collections, and string interpolation.

        // h1 and div are functions that take a lambda parameter:
        h1 {
            // When you add the + sign in front of a string literal, it appends the string to the enclosed HTML element:
            +"KotlinConf Explorer"
        }

        div {
            h3 {
                +"Videos to watch"
            }
            VideoList {
                videos = unwatchedVideos
                selectedVideo = currentVideo
                onSelectVideo = { video ->
                    currentVideo = video
                }
            }
            h3 {
                +"Videos watched"
            }
            VideoList {
                videos = watchedVideos
                selectedVideo = currentVideo
                onSelectVideo = { video ->
                    currentVideo = video
                }
            }
        }

        // The let scope function ensures that the VideoPlayer component is only added when state.currentVideo is not null.
        currentVideo?.let { curr ->
            VideoPlayer {
                video = curr
                unwatchedVideo = curr in unwatchedVideos
                onWatchedButtonPressed = {
                    if (video in unwatchedVideos) {
                        unwatchedVideos = unwatchedVideos - video
                        watchedVideos = watchedVideos + video
                    } else {
                        watchedVideos = watchedVideos - video
                        unwatchedVideos = unwatchedVideos + video
                    }
                }
            }
        }
    })
}