define(function (require, exports, module) {
  "use strict";

  var ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
      AppInit        = brackets.getModule("utils/AppInit"),
      EditorManager  = brackets.getModule("editor/EditorManager");

  ExtensionUtils.loadStyleSheet(module, "main.css");

  function indentSoftWraps(editor) {
    if (!editor) return;
    editor._codeMirror.on("renderLine", function (cm, line, elt) {
      var firstNonSpace = line.text.search(/\S/);
      if (firstNonSpace > 0) {
        var tabsCount     = line.text.substr(0, firstNonSpace).replace(/[^\t]/g, "").length,
            nonTabsCount  = firstNonSpace - tabsCount,
            off           = (nonTabsCount + tabsCount * cm.getOption("tabSize")) * cm.defaultCharWidth(),
            eltStyle      = window.getComputedStyle(elt, null),
            textIndent    = -off + "px",
            paddingLeft   =  off + "px";
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

  function addClass(elt, newClassName) {
    var r = new RegExp("\\b" + newClassName + "\\b")
    if (!r.test(elt.className)) {
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
