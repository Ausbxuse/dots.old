import QtQuick 2.0
import QtQuick.Controls 1.1
import Qt.labs.platform 1.0
import QtQuick.Layouts 1.1
import org.kde.plasma.core 2.0 as PlasmaCore
import org.kde.plasma.components 2.0 as PlasmaComponents
import org.kde.plasma.components 3.0 as PlasmaComponents3
import QtQuick.Controls 2.2 as QQC2
import QtQuick.Controls.Private 1.0
import QtQuick.XmlListModel 2.0
import ".."

Item {
    id: configGeneral
    Layout.fillWidth: true
    property string cfg_languages: plasmoid.configuration.languages
    property bool cfg_checkall: plasmoid.configuration.checkall
    property string cfg_engine: plasmoid.configuration.engine
    property var enginemodel: ["google", "yandex", "bing", "apertium"]
    property bool cfg_autodetect: plasmoid.configuration.autodetect
    property string metadataFilepath: plasmoid.file("", "../metadata.desktop")
    property string localversion: ""
    property string serverversion: ""
    property string serverlink: ""
    property string serverpage: ""
    property string appdata: ""
    property string updatepath: ""
    property string tmpfolder: ""

    PlasmaCore.DataSource {
        id: executable
        engine: "executable"
        connectedSources: []
        onNewData: {
            var exitCode = data["exit code"]
            var exitStatus = data["exit status"]
            var stdout = data["stdout"]
            var stderr = data["stderr"]
            exited(exitCode, exitStatus, stdout, stderr)
            disconnectSource(sourceName)
        }
        function exec(cmd) {
            connectSource(cmd)
        }
        signal exited(int exitCode, int exitStatus, string stdout, string stderr)
    }

    PlasmaCore.DataSource {
        id: update
        engine: "executable"
        connectedSources: []
        onNewData: {
            var exitCode = data["exit code"]
            var exitStatus = data["exit status"]
            var stdout = data["stdout"]
            var stderr = data["stderr"]
            exited(exitCode, exitStatus, stdout, stderr)
            disconnectSource(sourceName)
        }
        function exec(cmd) {
            connectSource(cmd)
        }
        signal exited(int exitCode, int exitStatus, string stdout, string stderr)
    }

    Connections {
        target: executable
        onExited: {
            if (localversion != stdout.replace('\n', ' ').trim()) {
                localversion = stdout.replace('\n', ' ').trim()
            }
        }
    }

    Connections {
        target: update
        onExited: {
            if (exitCode == 0) {
                t.state = "success"
                closenotif.start()
                var cmd = 'kreadconfig5 --file "' + metadataFilepath
                        + '" --group "Desktop Entry" --key "X-KDE-PluginInfo-Version"'
                executable.exec(cmd)
            } else {
                t.state = "fail"
            }
        }
    }
    Timer {
        id: closenotif
        running: false
        repeat: false
        interval: 5000
        onTriggered: {
            anim2.start()
        }
    }

    XmlListModel {
        id: xmlModel
        source: "https://api.kde-look.org/ocs/v1/content/data/1395666"
        query: "/ocs/data/content"

        XmlRole {
            name: "version"
            query: "version/string()"
        }
        XmlRole {
            name: "downloadlink"
            query: "downloadlink1/string()"
        }
        XmlRole {
            name: "homepage"
            query: "homepage/string()"
        }
        onStatusChanged: {
            if (status === XmlListModel.Ready) {
                serverversion = xmlModel.get(0).version
                serverlink = xmlModel.get(0).downloadlink
                serverpage = xmlModel.get(0).homepage
                if (localversion != serverversion && updatepath.startsWith(
                            appdata)) {
                    t.state = 'notif'
                } else if (localversion != serverversion
                           && !updatepath.startsWith(appdata)) {
                    t.state = "fail"
                } else {

                }
            }
        }
    }

    Component.onCompleted: {
        var cmd = 'kreadconfig5 --file "' + metadataFilepath
                + '" --group "Desktop Entry" --key "X-KDE-PluginInfo-Version"'
        executable.exec(cmd)
        changeEngine()
        var s = StandardPaths.writableLocation(
                    StandardPaths.AppDataLocation).toString()
        appdata = s.slice(0, s.lastIndexOf("/")).replace("file://", "")
        updatepath = metadataFilepath.substr(0, metadataFilepath.indexOf(
                                                 plasmoid.pluginName))
        console.log(updatepath)
        tmpfolder = StandardPaths.writableLocation(
                    StandardPaths.TempLocation).toString().replace("file://",
                                                                   "")
    }
    Connections {
        target: plasmoid.configuration
        onEngineChanged: {
            changeEngine()
        }
    }

    ColumnLayout {
        anchors.fill: parent
        Layout.alignment: Qt.AlignTop | Qt.AlignRight
        RowLayout {
            Layout.fillHeight: true
            Layout.fillWidth: true
            SequentialAnimation {
                id: anim
                NumberAnimation {
                    target: t
                    property: "Layout.preferredHeight"
                    duration: units.longDuration
                    from: 0
                    to: updatetext.paintedHeight + units.largeSpacing * 1.5
                    loops: 1
                }
                NumberAnimation {
                    target: t
                    property: "opacity"
                    duration: units.longDuration * 2
                    from: 0
                    to: 1
                    loops: 1
                }
            }
            SequentialAnimation {
                id: anim2
                NumberAnimation {
                    target: t
                    property: "opacity"
                    duration: units.longDuration * 2
                    from: 1
                    to: 0
                    loops: 1
                }
                NumberAnimation {
                    target: t
                    property: "Layout.preferredHeight"
                    duration: units.longDuration
                    from: updatetext.paintedHeight + units.largeSpacing * 1.5
                    to: 0
                    loops: 1
                }
            }
            Rectangle {
                id: t
                visible: false
                opacity: 0
                Layout.fillWidth: true
                Layout.preferredHeight: updatetext.paintedHeight + units.largeSpacing * 1.5
                color: "transparent"
                radius: units.smallSpacing / 2
                onStateChanged: {
                    if (state == "notif") {
                        anim.start()
                    }
                }
                states: [
                    State {
                        name: "notif"
                        PropertyChanges {
                            target: t
                            border.color: PlasmaCore.Theme.highlightColor
                            visible: true
                        }
                        PropertyChanges {
                            target: fill
                            color: PlasmaCore.Theme.highlightColor
                        }
                        PropertyChanges {
                            target: ico
                            source: "update-none"
                        }
                        PropertyChanges {
                            target: updatetext
                            text: i18n("Update is available") + ' (' + serverversion + ').'
                        }
                        PropertyChanges {
                            target: upd
                            visible: true
                        }
                        PropertyChanges {
                            target: cng
                            visible: true
                        }
                    },
                    State {
                        name: "success"
                        PropertyChanges {
                            target: t
                            border.color: PlasmaCore.Theme.positiveTextColor
                            visible: true
                        }
                        PropertyChanges {
                            target: fill
                            color: PlasmaCore.Theme.positiveTextColor
                        }
                        PropertyChanges {
                            target: ico
                            source: "checkbox"
                        }
                        PropertyChanges {
                            target: updatetext
                            text: i18n("Update finished. Please restart the session.")
                            anchors.right: parent.right
                        }
                        PropertyChanges {
                            target: busy
                            visible: false
                            running: false
                        }
                    },
                    State {
                        name: "fail"
                        PropertyChanges {
                            target: t
                            border.color: PlasmaCore.Theme.negativeTextColor
                            visible: true
                        }
                        PropertyChanges {
                            target: fill
                            color: PlasmaCore.Theme.negativeTextColor
                        }
                        PropertyChanges {
                            target: ico
                            source: "dialog-close"
                        }
                        PropertyChanges {
                            target: updatetext
                            text: i18n("Update failed. Make sure that the widget is install in user's home directory.")
                            anchors.right: parent.right
                        }
                        PropertyChanges {
                            target: busy
                            visible: false
                            running: false
                        }
                    }
                ]

                Rectangle {
                    id: fill
                    anchors.fill: parent
                    opacity: 0.2
                    radius: units.smallSpacing / 2 * 0.6
                }

                PlasmaCore.IconItem {
                    id: ico
                    source: ""
                    height: parent.height
                    anchors.left: parent.left
                    anchors.leftMargin: units.smallSpacing
                }

                Label {
                    id: updatetext
                    opacity: 1
                    Layout.fillHeight: true
                    anchors.left: ico.right
                    anchors.leftMargin: units.smallSpacing
                    anchors.top: parent.top
                    anchors.bottom: parent.bottom
                    width: t.width - ico.width - upd.width - cng.width - units.largeSpacing
                    text: ""
                    wrapMode: Text.WordWrap
                    verticalAlignment: Text.AlignVCenter
                }
                BusyIndicator {
                    id: busy
                    visible: false
                    running: true
                    anchors.verticalCenter: parent.verticalCenter
                    height: parent.height / 2
                    anchors.right: upd.left
                }

                Button {
                    visible: false
                    id: upd
                    text: i18n("Update")
                    iconName: "update-none"
                    anchors.verticalCenter: parent.verticalCenter
                    anchors.right: cng.left
                    anchors.rightMargin: units.smallSpacing / 2
                    onClicked: {
                        applyUpdate()
                        this.enabled = false
                    }
                }
                Button {
                    id: cng
                    visible: false
                    text: i18n("Changelog")
                    iconName: "globe"
                    anchors.verticalCenter: parent.verticalCenter
                    anchors.right: parent.right
                    anchors.rightMargin: units.smallSpacing
                    onClicked: {
                        Qt.openUrlExternally(
                                    "https://store.kde.org/p/1395666#updates-panel")
                    }
                }
            }
        }
        RowLayout {
            Layout.fillWidth: true
            width: parent.width
            Label {
                text: i18n("Translate engine:")
            }
            QQC2.ComboBox {
                Layout.fillWidth: false
                implicitWidth: 90
                id: engine
                model: configGeneral.enginemodel
                currentIndex: engine.model.indexOf(
                                  plasmoid.configuration.engine)
                onActivated: {
                    configGeneral.cfg_engine = model[index]
                    plasmoid.configuration.engine = model[index]
                }
            }
            Item {
                Layout.fillWidth: true
            }

            CheckBox {
                id: autosource
                anchors.right: parent.right
                text: i18n("Autodetect source")
                checked: cfg_autodetect
                onClicked: {
                    cfg_autodetect = checked
                }
            }
        }

        Label {
            id: notif
            text: cfg_autodetect ? i18n("Please make sure that at least one language is selected.") : i18n(
                                       "Please make sure that at least two languages are selected.")
        }
        TextField {
            id: searchField
            Layout.fillWidth: true
            placeholderText: i18n("Filter...")
            PlasmaCore.IconItem {
                source: "edit-clear"
                visible: searchField.text.length > 0
                height: parent.height
                anchors.right: parent.right
                anchors.rightMargin: units.smallSpacing
                MouseArea {
                    anchors.fill: parent
                    onClicked: {
                        searchField.text = ""
                    }
                }
            }
        }

        TableView {
            id: langTable
            model: PlasmaCore.SortFilterModel {
                sourceModel: LangModel {
                    id: langModel
                }
                filterRegExp: searchField.text
                filterRole: "com"
            }

            Layout.alignment: Qt.AlignTop | Qt.AlignRight
            Layout.fillHeight: true
            Layout.fillWidth: true
            TableViewColumn {
                title: "👁"
                role: "active"
                width: 30
                horizontalAlignment: Qt.AlignHCenter
                delegate: Item {
                    anchors.fill: parent
                    CheckBox {
                        id: check
                        anchors.fill: parent
                        anchors.leftMargin: 5
                        anchors.centerIn: parent
                        visible: model ? model.enabled : false
                        checked: model ? model.active : false
                        onVisibleChanged: if (visible)
                                              checked = styleData.value
                        onCheckedChanged: {
                            model ? model.active = checked : undefined
                            if (this.checked === false) {
                                configGeneral.cfg_checkall = false
                            }

                            cfg_languages = JSON.stringify(getLanguagesArray())
                            getLangNumbers()
                        }
                    }
                    PlasmaCore.IconItem {
                        source: "error"
                        visible: !check.visible
                        anchors.fill: parent
                        anchors.centerIn: parent
                        MouseArea {
                            anchors.fill: parent
                            onEntered: {

                            }
                        }
                    }
                }
            }

            TableViewColumn {

                role: "lang"
                title: i18n("Name")
                horizontalAlignment: Qt.AlignHCenter
                delegate: Label {
                    text: styleData.value
                    enabled: model ? model.enabled : false
                    horizontalAlignment: Qt.AlignHCenter
                }
            }

            TableViewColumn {

                role: "nativelang"
                title: i18n("Native Name")
                horizontalAlignment: Qt.AlignHCenter
                delegate: Label {
                    text: styleData.value
                    enabled: model ? model.enabled : false
                    horizontalAlignment: Qt.AlignHCenter
                }
            }

            TableViewColumn {
                role: "code"
                title: i18n("Code")
                width: 125
                horizontalAlignment: Qt.AlignHCenter
                delegate: Label {
                    text: styleData.value
                    enabled: model ? model.enabled : false
                    horizontalAlignment: Qt.AlignHCenter
                }
            }
            onClicked: {
                moveUp.enabled = true
                moveDown.enabled = true
            }
        }
        RowLayout {
            id: buttonsRow
            Layout.alignment: Qt.AlignLeft | Qt.AlignTop
            Layout.fillHeight: true

            CheckBox {
                id: checkAll
                text: this.checked ? i18n("Uncheck all") : i18n("Check all")
                Layout.fillWidth: false
                Layout.alignment: Qt.AlignLeft
                Layout.minimumWidth: parent.width / 2

                checked: configGeneral.cfg_checkall
                onClicked: {
                    var i
                    if (this.checked === false) {
                        for (i = 0; i < langModel.count; ++i) {
                            langModel.set(i, {
                                              "active": false
                                          })
                        }
                    } else {
                        for (i = 0; i < langModel.count; ++i) {
                            langModel.set(i, {
                                              "active": true
                                          })
                        }
                    }
                    cfg_languages = JSON.stringify(getLanguagesArray())
                    langModel.clear()
                    var languages = JSON.parse(cfg_languages)
                    for (i = 0; i < languages.length; i++) {
                        langModel.append(languages[i])
                        getLangNumbers()
                    }
                }
            }
            Item {
                Layout.fillWidth: true
            }
            Button {
                id: moveUp
                text: i18n("Move up")
                iconName: "go-up"
                enabled: false
                Layout.fillWidth: false
                onClicked: {
                    if (langTable.currentRow == -1
                            || langTable.currentRow == 0) {
                        this.enabled === false
                        return
                    }
                    langTable.model.move(langTable.currentRow,
                                         langTable.currentRow - 1, 1)
                    langTable.selection.clear()
                    langTable.selection.select(langTable.currentRow - 1)
                    cfg_languages = JSON.stringify(getLanguagesArray())
                }
            }

            Button {
                id: moveDown
                text: i18n("Move down")
                iconName: "go-down"
                Layout.fillWidth: false
                enabled: false
                onClicked: {
                    if (langTable.currentRow == -1
                            || langTable.currentRow == langTable.model.count - 1) {
                        this.enabled === false
                        return
                    }
                    langTable.model.move(langTable.currentRow,
                                         langTable.currentRow + 1, 1)
                    langTable.selection.clear()
                    langTable.selection.select(langTable.currentRow + 1)
                    cfg_languages = JSON.stringify(getLanguagesArray())
                }
            }
        }
    }

    function getLanguagesArray() {
        var langArray = []
        for (var i = 0; i < langModel.count; i++) {
            langArray.push(langModel.get(i))
        }
        return langArray
    }
    function getLangNumbers() {
        var j = 0
        for (var i = 0; i < langModel.count; i++) {
            if (langModel.get(i).active === true) {
                j = j + 1
            }
        }
        if (j > 1) {
            notif.color = SystemPaletteSingleton.text(enabled)
        } else {
            notif.color = "red"
        }
    }
    function changeEngine() {
        langModel.clear()
        var eng = configGeneral.cfg_engine
        var languages = JSON.parse(cfg_languages)
        for (var i = 0; i < languages.length; i++) {
            langModel.append(languages[i])
            langModel.set(i, {
                              "enabled": true
                          })
            langModel.set(i, {
                              "com": languages[i].lang + languages[i].nativelang + languages[i].code
                          })
        }
        for (var j = 0; j < languages.length; j++) {
            if (langModel.get(j)[eng] === false) {
                langModel.set(j, {
                                  "enabled": false,
                                  "active": false
                              })
            }
        }
    }
    function applyUpdate() {
        updatetext.text = i18n("Updating...")
        busy.visible = true
        console.log("UPDATE")
        update.exec("wget -O " + tmpfolder + "/" + plasmoid.pluginName
                    + ".tar.gz " + serverlink + " && tar -C " + updatepath
                    + "/ -xvzf " + tmpfolder + "/" + plasmoid.pluginName
                    + ".tar.gz && rm " + tmpfolder + "/" + plasmoid.pluginName + ".tar.gz")
    }
}
