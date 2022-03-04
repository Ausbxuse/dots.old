import QtQuick 2.1
import Qt.labs.platform 1.0
import QtQuick.Controls 1.2
import QtQuick.Layouts 1.1
import QtQuick.Controls 2.2 as QQC2
import org.kde.plasma.core 2.0 as PlasmaCore
import org.kde.plasma.components 2.0 as PlasmaComponents
import QtMultimedia 5.8
import org.kde.plasma.plasmoid 2.0
import QtGraphicalEffects 1.0
import QtQuick.Controls.Styles 1.4
import QtQuick.Controls.Private 1.0
import QtQuick.Window 2.2
import ".."

Item {
    id: root
    Layout.fillWidth: true
    Layout.fillHeight: true
    //   focus: true
    anchors.centerIn: parent
    property string cfg_languages: plasmoid.configuration.languages
    property string toDelete: ""
    property string lefttext: ""
    property string righttext: ""
    property var langlist: []
    property var codelist: []
    property var ttslist: []
    property var detectlist: [i18n("Autodetect")]
    property int sourceIndex: plasmoid.configuration.sourceIndex
    property int destinationIndex: plasmoid.configuration.destinationIndex
    property int popupIndex: -1
    property bool ind: false
    property string swapText: ""
    property int swapIndex: 0
    property string imgurl: "../images/icon.svg"
    property string cfg_engine: plasmoid.configuration.engine
    property bool cfg_autodetect: plasmoid.configuration.autodetect
    property bool indlang: false
    property bool pins: false
    property bool pack: true
    property bool actl: false
    property bool actr: false
    property string windowtext
    property string tmpfolder: StandardPaths.writableLocation(
                                   StandardPaths.TempLocation).toString(
                                   ).replace("file://", "")

    LangModel {
        id: langModel
    }

    Window {
        id: info
        visible: false
        minimumWidth: 300 * units.devicePixelRatio
        minimumHeight: 300 * units.devicePixelRatio
        title: i18n("Translator")
        flags: Qt.WindowStaysOnTopHint
        color: PlasmaCore.ColorScope.backgroundColor
        onClosing: {
            windowtext = ""
            xselclear.exec('xsel --clear')
        }

        //        ComboBox3 {
        //            id: lang
        //            editable: true
        //            Layout.fillWidth: true
        //            model: root.cfg_autodetect ? root.detectlist : root.langlist
        //            currentIndex: root.cfg_autodetect ? 0 : root.sourceIndex
        //            onCurrentIndexChanged: {

        //                //    root.sourceIndex = sourceLang.currentIndex
        //                //    plasmoid.configuration.sourceIndex = root.sourceIndex
        //            }
        //        }
        //        PlasmaComponents.TextArea {
        //            id: windowarea
        //            text: windowtext
        //            width: parent.width
        //            height: parent.height
        //            anchors.top: parent.top
        //            anchors.topMargin: units.smallSpacing
        //            anchors.bottom: parent.bottom
        //        }
        ColumnLayout {
            Layout.fillHeight: true
            Layout.fillWidth: true
            width: parent.width
            height: parent.height
            anchors.top: parent.top
            anchors.topMargin: units.smallSpacing
            anchors.bottom: parent.bottom
            RowLayout {
                Layout.minimumWidth: parent.width
                width: parent.width
                Layout.fillWidth: true
                PlasmaComponents.Label {
                    id: destpopup
                    text: i18n("Destination")
                    Layout.alignment: Qt.AlignLeft | Qt.AlignHCenter
                }
                ComboBox3 {
                    editable: true
                    id: destinationpopup
                    Layout.fillWidth: true
                    //   rightPadding: sw.width
                    Layout.alignment: Qt.AlignLeft | Qt.AlignHCenter
                    model: root.langlist
                    currentIndex: getLocale()
                    onCurrentIndexChanged: {
                        root.popupIndex = destinationpopup.currentIndex
                    }
                    onActivated: {
                        falsetime.start()
                    }
                }
                PlasmaComponents.ToolButton {
                    Layout.fillWidth: false
                    Layout.alignment: Qt.AlignLeft | Qt.AlignVCenter
                    iconSource: "edit-copy"
                    enabled: windowarea.focus
                    tooltip: i18n("Copy")
                    onClicked: {
                        windowarea.selectAll()
                        windowarea.copy()
                        windowarea.deselect()
                    }
                }
            }
            PlasmaComponents.TextArea {
                id: windowarea
                Layout.fillWidth: true
                focus: true
                Layout.fillHeight: true
                wrapMode: Text.WordWrap
                readOnly: true
                text: root.windowtext
            }
        }

        Component.onCompleted: {
            setX(Screen.width / 2 - width / 2)
            setY(Screen.height / 2 - height / 2)
        }
        Action {
            id: close
            shortcut: "Esc"
            onTriggered: {
                info.close()
            }
        }
    }

    PlasmaCore.DataSource {
        id: executable
        engine: "executable"
        connectedSources: []
        onNewData: {
            var exitCode = data["exit code"]
            var exitStatus = data["exit status"]
            var stdout = data["stdout"]
            var stderr = data["stderr"]
            exited(sourceName, exitCode, exitStatus, stdout, stderr)
            disconnectSource(sourceName)
        }
        function exec(cmd) {
            if (cmd) {
                connectSource(cmd)
            }
        }
        signal exited(string cmd, int exitCode, int exitStatus, string stdout, string stderr)
    }
    PlasmaCore.DataSource {
        id: checkpackage
        engine: "executable"
        connectedSources: []
        onNewData: {
            var exitCode = data["exit code"]
            var exitStatus = data["exit status"]
            var stdout = data["stdout"]
            var stderr = data["stderr"]
            exited(sourceName, exitCode, exitStatus, stdout, stderr)
            disconnectSource(sourceName)
        }
        function exec(cmd) {
            if (cmd) {
                connectSource(cmd)
            }
        }
        signal exited(string cmd, int exitCode, int exitStatus, string stdout, string stderr)
    }
    PlasmaCore.DataSource {
        id: listen
        engine: "executable"
        connectedSources: []
        onNewData: {
            var exitCode = data["exit code"]
            var exitStatus = data["exit status"]
            var stdout = data["stdout"]
            var stderr = data["stderr"]
            exited(sourceName, exitCode, exitStatus, stdout, stderr)
            disconnectSource(sourceName)
        }
        function exec(cmd) {
            if (cmd) {
                connectSource(cmd)
            }
        }
        signal exited(string cmd, int exitCode, int exitStatus, string stdout, string stderr)
    }

    PlasmaCore.DataSource {
        id: xsel
        engine: "executable"
        connectedSources: []
        onNewData: {
            var exitCode = data["exit code"]
            var exitStatus = data["exit status"]
            var stdout = data["stdout"]
            var stderr = data["stderr"]
            exited(sourceName, exitCode, exitStatus, stdout, stderr)
            disconnectSource(sourceName)
        }
        function exec(cmd) {
            if (cmd) {
                connectSource(cmd)
            }
        }
        signal exited(string cmd, int exitCode, int exitStatus, string stdout, string stderr)
    }
    PlasmaCore.DataSource {
        id: xselclear
        engine: "executable"
        connectedSources: []
        onNewData: {
            var exitCode = data["exit code"]
            var exitStatus = data["exit status"]
            var stdout = data["stdout"]
            var stderr = data["stderr"]
            exited(sourceName, exitCode, exitStatus, stdout, stderr)
            disconnectSource(sourceName)
        }
        function exec(cmd) {
            if (cmd) {
                connectSource(cmd)
            }
        }
        signal exited(string cmd, int exitCode, int exitStatus, string stdout, string stderr)
    }

    PlasmaCore.DataSource {
        id: detect
        engine: "executable"
        connectedSources: []
        onNewData: {
            var exitCode2 = data["exit code"]
            var exitStatus2 = data["exit status"]
            var stdout2 = data["stdout"]
            var stderr2 = data["stderr"]
            exited(sourceName, exitCode2, exitStatus2, stdout2, stderr2)
            disconnectSource(sourceName)
        }
        function exec(cmd2) {
            if (cmd2) {
                connectSource(cmd2)
            }
        }
        signal exited(string cmd2, int exitCode2, int exitStatus2, string stdout2, string stderr2)
    }
    function checkPackage() {
        checkpackage.exec("trans -V")
    }

    function detectsource() {
        root.detectlist = []
        var formattedText3 = root.lefttext.replace(/"/g,
                                                   '\\\"').replace("`", "\'")
        detect.exec("trans " + formattedText3 + " -identify")
    }

    function translate() {
        root.ind = true
        var formattedText = root.lefttext.replace(/"/g,
                                                  '\\\"').replace("`", "\'")
        var autod = root.cfg_autodetect == true ? "" : root.codelist[root.sourceIndex]
        executable.exec(
                    "trans {" + autod + "=" + root.codelist[root.destinationIndex]
                    + "} " + " " + "\"" + formattedText + "\"" + " -brief "
                    + "-e " + root.cfg_engine + " -no-bidi")
    }

    function listend(text, orig) {
        var formattedText2 = text.replace(/"/g, '\\\"')
        listen.exec("trans " + orig + ":en " + "\"" + formattedText2 + "\""
                    + " -brief -no-translate -download-audio-as trans.mp3 && mv trans.mp3 "
                    + tmpfolder)
    }

    Connections {
        target: listen
        onExited: {
            playSound.source = tmpfolder + "/trans.mp3"
            playSound.play()
        }
    }
    Connections {
        target: executable
        onExited: {
            var formattedText = stdout.trim()
            var errorText = stderr
            root.righttext = formattedText.length
                    > 0 ? formattedText : "Unable to translate.\nError: " + errorText

            root.ind = false
        }
    }
    Connections {
        target: checkpackage
        onExited: {
            var formattedText = stdout.trim()
            var errorText = stderr.trim()
            if (errorText.indexOf("trans") !== -1) {
                root.pack = false
            } else {
                root.pack = true
            }
        }
    }

    Connections {
        target: xsel
        onExited: {
            var formattedText = stdout.trim()
            var errorText = stderr.trim()
            console.log(formattedText)
            console.log(errorText)
            if (formattedText.length > 0 || errorText.length > 0) {
                windowtext = formattedText.length > 0 ? formattedText : errorText
                windowarea.text = windowtext
                info.show()
                windowarea.focus = true
            } else {
                plasmoid.expanded = true
            }
        }
    }

    Connections {
        target: detect
        onExited: {
            var formattedText4 = stdout2.trim()
            var lang = formattedText4.split("\n")[1].replace("[22m",
                                                             "").replace(
                        "Name                  [1m", "").replace("[22m", "")
            var copy = []
            root.detectlist = []
            copy.push(lang)
            root.detectlist = copy
            root.indlang = true
        }
    }

    Component.onCompleted: {
        loadLangModel()
        root.sourceIndex = plasmoid.configuration.sourceIndex
        root.destinationIndex = plasmoid.configuration.destinationIndex
        checkPackage()
        xselclear.exec('xsel --clear')
    }

    Connections {
        target: plasmoid.configuration
        onLanguagesChanged: {
            loadLangModel()
            root.sourceIndex = 0
            root.destinationIndex = cfg_autodetect ? 0 : 1
        }
    }

    Plasmoid.onActivated: {
        falsetime.start()
    }
    Timer {
        id: falsetime
        interval: 0
        repeat: false
        onTriggered: {
            var v = root.popupIndex == -1 ? "" : root.codelist[root.popupIndex]
            plasmoid.expanded = false
            xsel.exec('xsel -o | trans :' + v + ' -e ' + root.cfg_engine + ' -b  -no-bidi')
        }
    }

    Plasmoid.compactRepresentation: Item {
        id: compRoot
        width: parent.width
        height: parent.width
        PlasmaCore.SvgItem {
            id: ima
            opacity: 1
            anchors.fill: parent
            width: parent.width
            height: parent.height
            svg: PlasmaCore.Svg {
                id: svg
                imagePath: Qt.resolvedUrl(root.imgurl)
            }
        }
        MouseArea {
            id: mouseArea
            width: parent.width
            height: parent.width
            anchors.fill: parent
            hoverEnabled: true
            onClicked: {
                plasmoid.expanded = !plasmoid.expanded
            }
        }
    }

    Plasmoid.fullRepresentation: Item {

        Plasmoid.onExpandedChanged: {
            if (expanded) {
                checkPackage()
                time.start()
            }
        }
        Plasmoid.hideOnWindowDeactivate: !root.pins
        id: fullRoot
        Layout.preferredWidth: 600 * units.devicePixelRatio
        Layout.preferredHeight: 300 * units.devicePixelRatio
        enabled: !root.ind
        Layout.fillHeight: true
        Layout.fillWidth: true

        Timer {
            id: time
            onTriggered: {

                leftPanel.forceActiveFocus()
            }
            interval: 200
            running: false
            repeat: false
        }
        ColumnLayout {
            Layout.fillHeight: true
            Layout.fillWidth: true
            height: parent.height
            width: parent.width
            visible: root.langlist.length > 1 && root.pack == true
            GridLayout {
                columns: 3
                width: parent.width
                Layout.maximumWidth: parent.width

                ColumnLayout {

                    Layout.fillWidth: true
                    Layout.maximumWidth: (parent.width - sw.width) / 2 - units.smallSpacing
                    RowLayout {
                        Layout.fillWidth: true
                        width: parent.width
                        PlasmaComponents.Label {
                            text: i18n("Source")
                            Layout.fillWidth: false
                            Layout.alignment: Qt.AlignLeft | Qt.AlignHCenter
                        }

                        ComboBox3 {
                            id: sourceLang
                            editable: true
                            Layout.fillWidth: true
                            rightPadding: sw.width
                            enabled: !root.cfg_autodetect
                            model: root.cfg_autodetect ? root.detectlist : root.langlist
                            currentIndex: root.cfg_autodetect ? 0 : root.sourceIndex
                            onCurrentIndexChanged: {
                                root.sourceIndex = sourceLang.currentIndex
                                plasmoid.configuration.sourceIndex = root.sourceIndex
                            }
                        }

                        PlasmaComponents.ToolButton {
                            id: clearbutton
                            flat: true
                            tooltip: i18n("Clear all (Esc)")
                            iconSource: "edit-clear-all-symbolic"
                            enabled: leftPanel.text.length > 0
                            onClicked: {
                                clear.trigger()
                                root.indlang = false
                            }
                        }
                    }
                    PlasmaComponents.TextArea {
                        id: leftPanel
                        Layout.fillWidth: true
                        Layout.fillHeight: true
                        Layout.maximumWidth: parent.width
                        text: root.lefttext
                        onTextChanged: {
                            root.lefttext = leftPanel.text
                            if (this.text.length == 0) {
                                var copy = ["Autodetect"]
                                root.detectlist = copy
                                root.indlang = false
                            }
                        }
                    }

                    RowLayout {
                        width: parent.width
                        Layout.minimumWidth: parent.width
                        PlasmaComponents.ToolButton {
                            property bool act: root.actl
                            Layout.fillWidth: false
                            id: playsource
                            iconSource: root.ttslist[root.sourceIndex]
                                        == true ? isPlaying()
                                                  && this.act ? "media-playback-stop" : "player-volume" : "audio-volume-muted"
                            tooltip: i18n("Listen")
                            enabled: root.ttslist[root.sourceIndex]
                                     == true ? leftPanel.text.length > 0
                                               && leftPanel.text.length < 201 ? true : false : false
                            onClicked: {
                                if (isPlaying() && this.act) {
                                    playSound.stop()
                                } else {
                                    playSound.stop()
                                    root.actl = true
                                    listend(root.lefttext,
                                            root.codelist[root.sourceIndex])
                                }
                            }
                        }
                        PlasmaComponents.ToolButton {
                            Layout.fillWidth: false
                            transformOrigin: Item.Left
                            Layout.alignment: Qt.AlignLeft | Qt.AlignVCenter
                            iconSource: "edit-paste"
                            enabled: leftPanel.focus
                            tooltip: i18n("Paste (Ctrl+V)")
                            onClicked: {
                                paste.trigger()
                            }
                        }

                        PlasmaComponents.Label {
                            text: leftPanel.text.length + "/5000"
                            Layout.fillWidth: true
                            enabled: leftPanel.text.length > 0
                            color: leftPanel.text.length
                                   > 5000 ? "red" : PlasmaCore.ColorScope.textColor
                            verticalAlignment: Text.AlignVCenter
                            horizontalAlignment: Text.AlignRight
                            Layout.alignment: Qt.AlignRight | Qt.AlignVCenter
                        }
                    }
                }
                ColumnLayout {
                    Layout.fillWidth: true
                    id: sw
                    PlasmaComponents.ToolButton {
                        Layout.fillWidth: false
                        tooltip: i18n("Swap panels (CTRL+S)")
                        iconSource: "document-swap"
                        Layout.alignment: Qt.AlignHCenter | Qt.AlignVCenter
                        enabled: !cfg_autodetect
                                 && root.sourceIndex !== root.destinationIndex
                        onClicked: {
                            swap.trigger()
                            playSound.stop()
                        }
                        BusyIndicator {
                            id: busyIndicator
                            Layout.alignment: Qt.AlignVCenter | Qt.AlignHCenter
                            Layout.fillWidth: true
                            Layout.fillHeight: true
                            width: parent.width
                            height: parent.height
                            enabled: true
                            running: root.ind
                            visible: root.ind
                        }
                    }
                }

                ColumnLayout {
                    Layout.maximumWidth: (parent.width - sw.width) / 2 - units.smallSpacing
                    Layout.fillWidth: true
                    RowLayout {
                        Layout.minimumWidth: parent.width
                        width: parent.width
                        Layout.fillWidth: true
                        PlasmaComponents.Label {
                            id: des
                            text: i18n("Destination")
                            Layout.alignment: Qt.AlignLeft | Qt.AlignHCenter
                        }
                        ComboBox3 {
                            editable: true
                            id: destination
                            Layout.fillWidth: true
                            rightPadding: sw.width
                            Layout.alignment: Qt.AlignLeft | Qt.AlignHCenter
                            model: root.langlist
                            currentIndex: model ? root.destinationIndex : -1
                            onCurrentIndexChanged: {
                                root.destinationIndex = destination.currentIndex
                                plasmoid.configuration.destinationIndex = root.destinationIndex
                            }
                            onActivated: {
                                root.lefttext.length > 0 ? translate() : ""
                            }
                        }
                        PlasmaComponents.ToolButton {
                            id: pinbutton
                            visible: plasmoid.location !== PlasmaCore.Types.Floating
                            flat: true
                            tooltip: i18n("Pin window (CTRL+P)")
                            iconSource: "window-pin"
                            checked: root.pins
                            checkable: true
                            onCheckedChanged: checked ? root.pins = true : root.pins = false
                        }
                    }
                    PlasmaComponents.TextArea {
                        id: rightPanel
                        Layout.fillWidth: true
                        Layout.fillHeight: true
                        wrapMode: Text.WordWrap
                        readOnly: true
                        text: root.righttext
                        onTextChanged: {
                            root.righttext = rightPanel.text
                        }
                    }

                    RowLayout {
                        width: parent.width
                        Layout.minimumWidth: parent.width
                        PlasmaComponents.ToolButton {
                            property bool act: root.actr
                            Layout.fillWidth: false
                            id: playdest
                            transformOrigin: Item.Left
                            iconSource: root.ttslist[root.destinationIndex]
                                        == true ? isPlaying()
                                                  && this.act ? "media-playback-stop" : "player-volume" : "audio-volume-muted"
                            tooltip: i18n("Listen")
                            enabled: root.ttslist[root.destinationIndex]
                                     == true ? rightPanel.text.length > 0
                                               && rightPanel.text.length
                                               < 201 ? true : false : false
                            onClicked: {
                                if (isPlaying() && this.act) {
                                    playSound.stop()
                                } else {
                                    playSound.stop()
                                    root.actr = true
                                    listend(root.righttext,
                                            root.codelist[root.destinationIndex])
                                }
                            }
                        }
                        PlasmaComponents.ToolButton {
                            Layout.fillWidth: false
                            Layout.alignment: Qt.AlignLeft | Qt.AlignVCenter
                            iconSource: "edit-copy"
                            enabled: rightPanel.focus
                                     && rightPanel.text.length > 0
                            tooltip: i18n("Copy (Ctrl+C)")
                            onClicked: {

                                copy.trigger()
                            }
                        }
                        Item {
                            Layout.fillWidth: true
                        }

                        PlasmaComponents.ToolButton {
                            id: transbutton
                            Layout.alignment: Qt.AlignRight
                            flat: true
                            transformOrigin: Item.Right
                            iconSource: "globe"
                            minimumWidth: 1
                            Layout.preferredWidth: this.minimumWidth + units.smallSpacing
                            text: i18n("Translate")
                            tooltip: i18n("Translate (CTRL+Enter)")
                            Layout.fillWidth: false
                            enabled: leftPanel.text.length > 0
                                     && leftPanel.text.length < 5001
                                     && root.sourceIndex !== root.destinationIndex
                                     || root.cfg_autodetect ? true : false
                            onClicked: {
                                trans.trigger()
                            }
                        }
                    }
                }
            }

            Action {
                id: trans
                shortcut: "Ctrl+Return"
                onTriggered: {
                    rightPanel.focus = true
                    if (transbutton.enabled === true) {
                        checkPackage()
                        root.righttext = ""
                        root.lefttext = leftPanel.text
                        translate()
                        if (root.cfg_autodetect == true
                                && root.indlang == false) {
                            detectsource()
                        }
                    }
                }
            }

            Action {
                id: transalt
                shortcut: "Ctrl+Enter"
                onTriggered: {
                    rightPanel.focus = true
                    if (transbutton.enabled === true) {
                        checkPackage()
                        root.righttext = ""
                        root.lefttext = leftPanel.text
                        translate()
                        if (root.cfg_autodetect == true
                                && root.indlang == false) {
                            detectsource()
                        }
                    }
                }
            }

            Action {
                id: clear
                shortcut: "Esc"
                onTriggered: {
                    leftPanel.remove(0, leftPanel.text.length)
                    rightPanel.remove(0, rightPanel.text.length)
                    if (root.cfg_autodetect) {
                        var copy = ["Autodetect"]
                        root.detectlist = copy
                    }
                    leftPanel.focus = true
                }
            }

            Action {
                id: swap
                shortcut: "Ctrl+S"
                onTriggered: {
                    root.swapText = root.lefttext
                    root.lefttext = root.righttext
                    root.righttext = root.swapText
                    root.swapIndex = root.sourceIndex
                    root.sourceIndex = root.destinationIndex
                    root.destinationIndex = root.swapIndex
                    leftPanel.focus = true
                }
            }
            Action {
                id: copy
                shortcut: "Ctrl+C"
                onTriggered: {
                    if (rightPanel.focus == true) {
                        rightPanel.selectAll()
                        rightPanel.copy()
                        rightPanel.deselect()
                    }
                }
            }
            Action {
                id: paste
                shortcut: "Ctrl+V"
                onTriggered: {
                    if (leftPanel.focus == true) {
                        leftPanel.selectAll()
                        leftPanel.paste()
                        leftPanel.deselect()
                    }
                }
            }
            Action {
                id: pinwindow
                shortcut: "Ctrl+P"
                onTriggered: {
                    root.pins = pinbutton.checked ? false : true
                }
            }
        }
        ColumnLayout {
            anchors.centerIn: parent
            visible: root.langlist.length < 2
            PlasmaComponents.Label {
                id: err
                width: parent.width
                anchors.horizontalCenter: parent.horizontalCenter
                text: cfg_autodetect ? i18n("Please make sure that at least one language is selected.") : i18n(
                                           "Please make sure that at least two languages are selected.")
                color: "red"
                horizontalAlignment: Text.AlignHCenter
            }
            PlasmaComponents.Button {
                anchors.top: err.bottom
                anchors.topMargin: 20
                anchors.horizontalCenter: parent.horizontalCenter
                text: i18n("Settings")
                onClicked: plasmoid.action("configure").trigger()
            }
        }

        ColumnLayout {
            anchors.centerIn: parent
            visible: root.pack == false
            PlasmaComponents.Label {
                id: install
                width: parent.width
                anchors.horizontalCenter: parent.horizontalCenter
                text: i18n("Please install translate-shell package and reboot or relog.")
                color: "red"
                horizontalAlignment: Text.AlignHCenter
            }
            PlasmaComponents.Button {
                anchors.top: install.bottom
                anchors.topMargin: 20
                anchors.horizontalCenter: parent.horizontalCenter
                text: i18n("How to install")
                onClicked: Qt.openUrlExternally(
                               "https://github.com/soimort/translate-shell/wiki/Distros/")
            }
        }
    }

    function loadLangModel() {
        var languages = JSON.parse(cfg_languages)
        var langcopy = []
        var codecopy = []
        var ttscopy = []
        for (var i = 0; i < languages.length; i++) {
            if (languages[i].active && languages[i].enabled) {
                langcopy.push(languages[i].lang)
                codecopy.push(languages[i].code)
                ttscopy.push(languages[i].tts)
            }
        }
        root.langlist = langcopy
        root.codelist = codecopy
        root.ttslist = ttscopy
    }

    function getLocale() {
        //TODO
        var myLocale = Qt.locale().name.split("_")[0]
        var myIndex = root.codelist.indexOf(myLocale)
        return myIndex
    }
    MediaPlayer {
        id: playSound
        onStopped: {
            root.actl = false
            root.actr = false
            playSound.source = ""
        }
        onError: {
            playSound.stop()
            playSound.source = ""
        }
    }
    function isPlaying() {
        return playSound.playbackState == MediaPlayer.PlayingState
    }
}
