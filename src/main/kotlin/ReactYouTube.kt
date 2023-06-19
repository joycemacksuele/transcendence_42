@file:JsModule("react-player")
@file:JsNonModule

import react.*

// React has a rich ecosystem with a lot of pre-made components you can use instead of building this functionality
// yourself, one of them is the react-player

external interface ReactPlayerProps : Props {
    var url: String
    var controls: Boolean
}

// To use the JavaScript package from inside the React application, it's necessary to tell the Kotlin compiler
// what to expect by providing it with external declarations.
// When the compiler sees an external declaration like ReactPlayer, it assumes that the implementation for the
// corresponding class is provided by the dependency and doesn't generate code for it.
@JsName("default")
external val ReactPlayer: ComponentClass<ReactPlayerProps>
// This two lines above are equivalent to a JavaScript import like require("react-player").default;.
// They tell the compiler that it's certain that a component will conform to ComponentClass<dynamic> at runtime.