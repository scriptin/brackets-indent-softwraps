define(function (require, exports, module) {
  "use strict";

  var ExtensionUtils     = brackets.getModule("utils/ExtensionUtils"),
      AppInit            = brackets.getModule("utils/AppInit"),
      EditorManager      = brackets.getModule("editor/EditorManager"),
      PreferencesManager = brackets.getModule("preferences/PreferencesManager");

  ExtensionUtils.loadStyleSheet(module, "main.css");

  var DEFAULT_GUTTER_WIDTH = 15;

  /**
   * https://github.com/scriptin/brackets-indent-softwraps/issues/13
   *
   * There are themes which apply some custom `padding-left`. We need
   * to extract that value and add it each time we calculate `padding-left`
   * and `text-indent` properties for wrapped lines.
   */
  var paddingLeftExtracted = false,
      paddingLeft3rdParty = 0;

  function extractPaddingLeft(elt) {
    if (!paddingLeftExtracted) {
      paddingLeft3rdParty = parseInt(window.getComputedStyle(elt)["padding-left"]);
      paddingLeftExtracted = true;
    }
    return paddingLeft3rdParty;
  }

  function indentSoftWraps(editor) {
    if (!editor) return;
    editor._codeMirror.on("renderLine", function (cm, line, elt) {
      var firstNonSpace = line.text.search(/\S/);
      if (firstNonSpace > -1) {
        var whitespace  = line.text.substr(0, firstNonSpace),
            offset      = countSpaces(whitespace, cm.getOption("tabSize")) * cm.defaultCharWidth(),
            eltStyle    = window.getComputedStyle(elt, null),
            textIndent  = -(offset + extractPaddingLeft(elt)) + "px",
            noGutter    = !PreferencesManager.get("showLineNumbers"),
            paddingLeft = (noGutter ? DEFAULT_GUTTER_WIDTH : 0) + offset + extractPaddingLeft(elt) + "px";
        if (textIndent != eltStyle["text-indent"]) {
          elt.style.textIndent = textIndent;
        }
        if (paddingLeft != eltStyle["padding-left"]) {
          elt.style.paddingLeft = paddingLeft;
        }
      }
      addClass(elt, "softwraps-indented");
    });
    editor.refresh();
  }

  function countSpaces(ws, tabSize) {
    var fullTabs = 0, remainderSpaces = 0;
    for (var i = 0; i < ws.length; i++) {
      if (ws[i] === "\t") {
        fullTabs++;
        remainderSpaces = 0;
      } else { // Assuming all other whitespace chars are just spaces
        remainderSpaces++;
        if (remainderSpaces === tabSize) {
          fullTabs++;
          remainderSpaces = 0;
        }
      }
    }
    return fullTabs * tabSize + remainderSpaces;
  }

  function hasClass(elt, className) {
    return (new RegExp("\\b" + className + "\\b")).test(elt.className);
  }

  function addClass(elt, newClassName) {
    if (!hasClass(elt, newClassName)) {
      if (elt.className.trim() === "") {
        elt.className = newClassName;
      } else {
        elt.className += " " + newClassName;
      }
    }
  }

  AppInit.appReady(function () {
    indentSoftWraps(EditorManager.getCurrentFullEditor());
    $(EditorManager).on("activeEditorChange", function (event, focusedEditor, lostEditor) {
      indentSoftWraps(focusedEditor);
    });
  });
});
