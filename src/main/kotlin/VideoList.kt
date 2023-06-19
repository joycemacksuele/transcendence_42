import kotlinx.browser.window
import react.*
import react.dom.*
import react.dom.html.ReactHTML.p

// Define an interface that holds all the props which can be passed to a VideoList component:
// The external modifier tells the compiler that the interface's implementation is provided externally,
// so it doesn't try to generate JavaScript code from the declaration.
external interface VideoListProps : Props {
    var videos: List<Video>
    var selectedVideo: Video?
    // function that takes a Video and returns Unit:
    var onSelectVideo: (Video) -> Unit
}

// Props = properties -> It passes data as an attribute to the component:
val VideoList = FC<VideoListProps> { props ->

    // Lift state
    // React makes sure that props can only be passed from a parent component to its children.
    // If a component wants to change state of a child component, it needs to move the logic for handling user
    // interaction to the parent component and then pass the logic in as a prop.
    // Remember that in Kotlin, variables can have the type of a function.
    // At that point, state also no longer belongs to any of the child components but to the parent component.
    // The process of migrating state from components to their parents is called lifting state.
    // In this case a state can be added to the App component

    for (video in props.videos) {
        p {
            // In React a “key” is a special string attribute you need to include when creating lists of elements.
            // It helps the React renderer figure out what to do when the value of props.videos changes.
            // It uses the key to determine which parts of a list need to be refreshed and which ones stay the same.
            // https://legacy.reactjs.org/docs/lists-and-keys.html
            key = video.id.toString()

            // onClick handler function triggers an alert with the current video:
            // OBS.: Defining an onClick function directly as lambda is concise and very useful for prototyping.
            // However, due to the way equality currently works in Kotlin/JS, performance-wise it's not the most
            // optimized way to pass click handlers. If you want to optimize rendering performance, consider storing
            // your functions in a variable and passing them.
            onClick = {
                // When the user clicks a video, its value is assigned to the selectedVideo variable:
                props.onSelectVideo(video)
            }

            // When the selected list entry is rendered, the triangle is prepended:
            if (video == props.selectedVideo) {
                +"▶ "
            }
            +"${video.speaker}: ${video.title}"
        }
    }
}