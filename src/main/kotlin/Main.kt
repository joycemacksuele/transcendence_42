import csstype.BackgroundColor
import kotlinx.browser.document
import react.*
import emotion.react.css
import csstype.Position
import csstype.px
import react.dom.html.ReactHTML.h1
import react.dom.html.ReactHTML.h3
import react.dom.html.ReactHTML.div
import react.dom.html.ReactHTML.p
import react.dom.html.ReactHTML.img
import react.dom.client.createRoot
import kotlinx.serialization.Serializable

// By default, the Kotlin/JS Gradle plugin comes with support for an embedded webpack-dev-server,
// allowing you to run the application from the IDE without manually setting up any servers.

// To test that the program successfully runs in the browser, start the development server by
// invoking the run or browserDevelopmentRun task (available in the other or kotlin browser directory)
// from the Gradle tool window inside IntelliJ IDEA.
// To run the program from the Terminal, use ./gradlew run instead.

fun main() {
//    document.bgColor = "cyan"
    val container = document.getElementById("root") ?: error("Couldn't find root container!")
    createRoot(container).render(App.create())
}