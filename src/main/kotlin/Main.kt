import kotlinx.browser.document
// By default, the Kotlin/JS Gradle plugin comes with support for an embedded webpack-dev-server,
// allowing you to run the application from the IDE without manually setting up any servers.

// To test that the program successfully runs in the browser, start the development server by
// invoking the run or browserDevelopmentRun task (available in the other or kotlin browser directory)
// from the Gradle tool window inside IntelliJ IDEA.
// To run the program from the Terminal, use ./gradlew run instead.
fun main() {
    document.bgColor = "red"
}