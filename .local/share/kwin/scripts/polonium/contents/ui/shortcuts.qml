// shortcuts.qml - Shortcuts

import QtQuick;
import org.kde.kwin;

Item {
    id: dbus;
    
    function getRetileWindow() {
        return retileWindow;
    }
    ShortcutHandler {
        id: retileWindow;
        
        name: "PoloniumRetileWindow";
        text: "Polonium: Retile Window";
        sequence: "Meta+Shift+Space";
    }
    
    function getOpenSettings() {
        return openSettings;
    }
    ShortcutHandler {
        id: openSettings;
        
        name: "PoloniumOpenSettings";
        text: "Polonium: Open Settings Dialog";
        sequence: "Meta+\\";
    }
    
    function getFocusAbove() {
        return focusAbove;
    }
    ShortcutHandler {
        id: focusAbove;
        
        name: "PoloniumFocusAbove";
        text: "Polonium: Focus Above";
        sequence: "Meta+K";
    }

    function getFocusBelow() {
        return focusBelow;
    }
    ShortcutHandler {
        id: focusBelow;
        
        name: "PoloniumFocusBelow";
        text: "Polonium: Focus Below";
        sequence: "Meta+J";
    }

    function getFocusLeft() {
        return focusLeft;
    }
    ShortcutHandler {
        id: focusLeft;
        
        name: "PoloniumFocusLeft";
        text: "Polonium: Focus Left";
        sequence: "Meta+H";
    }

    function getFocusRight() {
        return focusRight;
    }
    ShortcutHandler {
        id: focusRight;
        
        name: "PoloniumFocusRight";
        text: "Polonium: Focus Right";
        sequence: "Meta+L";
    }
    
    function getInsertAbove() {
        return insertAbove;
    }
    ShortcutHandler {
        id: insertAbove;
        
        name: "PoloniumInsertAbove";
        text: "Polonium: Insert Above";
        sequence: "Meta+Shift+K";
    }

    function getInsertBelow() {
        return insertBelow;
    }
    ShortcutHandler {
        id: insertBelow;
        
        name: "PoloniumInsertBelow";
        text: "Polonium: Insert Below";
        sequence: "Meta+Shift+J";
    }

    function getInsertLeft() {
        return insertLeft;
    }
    ShortcutHandler {
        id: insertLeft;
        
        name: "PoloniumInsertLeft";
        text: "Polonium: Insert Left";
        sequence: "Meta+Shift+H";
    }

    function getInsertRight() {
        return insertRight;
    }
    ShortcutHandler {
        id: insertRight;
        
        name: "PoloniumInsertRight";
        text: "Polonium: Insert Right";
        sequence: "Meta+Shift+L";
    }

    function getResizeAbove() {
        return resizeAbove;
    }
    ShortcutHandler {
        id: resizeAbove;
        
        name: "PoloniumResizeAbove";
        text: "Polonium: Resize Above";
        sequence: "Meta+Ctrl+K";
    }

    function getResizeBelow() {
        return resizeBelow;
    }
    ShortcutHandler {
        id: resizeBelow;
        
        name: "PoloniumResizeBelow";
        text: "Polonium: Resize Below";
        sequence: "Meta+Ctrl+J";
    }

    function getResizeLeft() {
        return resizeLeft;
    }
    ShortcutHandler {
        id: resizeLeft;
        
        name: "PoloniumResizeLeft";
        text: "Polonium: Resize Left";
        sequence: "Meta+Ctrl+H";
    }

    function getResizeRight() {
        return resizeRight;
    }
    ShortcutHandler {
        id: resizeRight;
        
        name: "PoloniumResizeRight";
        text: "Polonium: Resize Right";
        sequence: "Meta+Ctrl+L";
    }
}
