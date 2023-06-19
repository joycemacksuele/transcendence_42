@file:JsModule("react-share")
@file:JsNonModule

import react.ComponentClass
import react.Props

// An easy way to share the application's content is to have social share buttons for messengers and email.
// You can use an off-the-shelf React component for this as well, for example, react-share (https://github.com/nygardk/react-share/blob/master/README.md)

external interface IconProps : Props {
    var size: Int
    var round: Boolean
}

@JsName("EmailIcon")
external val EmailIcon: ComponentClass<IconProps>

@JsName("EmailShareButton")
external val EmailShareButton: ComponentClass<ShareButtonProps>

@JsName("TelegramIcon")
external val TelegramIcon: ComponentClass<IconProps>

@JsName("TelegramShareButton")
external val TelegramShareButton: ComponentClass<ShareButtonProps>

external interface ShareButtonProps : Props {
    var url: String
}