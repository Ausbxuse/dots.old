
/*
 *   Copyright 2016 Marco Martin <mart@kde.org>
 *
 *   This program is free software; you can redistribute it and/or modify
 *   it under the terms of the GNU Library General Public License as
 *   published by the Free Software Foundation; either version 2, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU Library General Public License for more details
 *
 *   You should have received a copy of the GNU Library General Public
 *   License along with this program; if not, write to the
 *   Free Software Foundation, Inc.,
 *   51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
import QtQuick 2.1
import QtQuick.Window 2.2
import QtQuick.Templates 2.2 as T
import QtQuick.Controls 2.2 as Controls
import QtGraphicalEffects 1.0
import org.kde.plasma.core 2.0 as PlasmaCore
import org.kde.kirigami 2.2 as Kirigami
import org.kde.plasma.components 3.0 as PlasmaComponents3

PlasmaComponents3.ComboBox {
    id: control

    contentItem: T.TextField {
        id: textField
        padding: 0
        anchors {
            fill: parent
            leftMargin: control.leftPadding
            rightMargin: control.rightPadding
            topMargin: control.topPadding
            bottomMargin: control.bottomPadding
        }
        text: control.editable ? control.editText : control.displayText

        enabled: control.editable
        autoScroll: control.editable
        selectByMouse: true

        readOnly: control.down || !control.hasOwnProperty("editable")
                  || !control.editable
        inputMethodHints: control.inputMethodHints
        validator: control.validator
        selectionColor: control.palette.highlight
        selectedTextColor: control.palette.highlightedText
        renderType: Screen.devicePixelRatio % 1 !== 0 ? Text.QtRendering : Text.NativeRendering
        color: PlasmaCore.ColorScope.textColor
        font: control.font
        horizontalAlignment: Text.AlignLeft
        verticalAlignment: Text.AlignVCenter
        opacity: control.enabled ? 1 : 0.3
        onFocusChanged: {
            if (focus) {

            }
        }
        onPressAndHold: {
            if (!Kirigami.Settings.tabletMode) {
                return
            }
            forceActiveFocus()
            cursorPosition = positionAt(event.x, event.y)
            selectWord()
        }
    }
}
