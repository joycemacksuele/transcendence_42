plugins {
    kotlin("js") version "1.8.20"
    kotlin("plugin.serialization") version "1.8.20"
}

group = "transcendence"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

dependencies {
//    testImplementation(kotlin("test"))
    // React, React DOM + Wrappers
    implementation(enforcedPlatform("org.jetbrains.kotlin-wrappers:kotlin-wrappers-bom:1.0.0-pre.430"))
    implementation("org.jetbrains.kotlin-wrappers:kotlin-react")
    implementation("org.jetbrains.kotlin-wrappers:kotlin-react-dom")
    implementation("org.jetbrains.kotlin-wrappers:kotlin-react-router-dom:6.3.0-pre.346")
//    implementation("org.jetbrains.kotlin-wrappers:kotlin-redux:4.1.2-pre.346")
//    implementation("org.jetbrains.kotlin-wrappers:kotlin-react-redux:7.2.6-pre.346")

    // Kotlin React Emotion (CSS)
    implementation("org.jetbrains.kotlin-wrappers:kotlin-emotion")

    // npm dependencies can be added to a Kotlin/JS project by using the npm() function in the dependencies block
    // of the build file. The Gradle plugin then takes care of downloading and installing these dependencies for you.
    // To do so, it uses its own bundled installation of the yarn package manager.

    // Video Player
    implementation(npm("react-player", "2.12.0"))

    // Share Buttons
    implementation(npm("react-share", "4.4.1"))

    // Coroutines & serialization
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.6.4")
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.5.0")
}

kotlin {
    js {
        browser {
            commonWebpackConfig {
                cssSupport {
                    enabled.set(true)
                }
            }
        }
        binaries.executable()
    }
}