define(function (require, exports, module) {
  "use strict";

  var ExtensionUtils = brackets.getModule("utils/ExtensionUtils");
  ExtensionUtils.loadStyleSheet(module, "main.css");

  /**
   * Indent softwrapped lines
   * @param editor Instance of Editor
   * @param forceRefresh Flag to force editor refresh
   */
  function handleEditor(editor, forceRefresh) {
    if (!editor) return;
    var changedSomething = false;
    editor._codeMirror.on("renderLine", function (cm, line, elt) {
      var firstNonSpace = line.text.search(/\S/);
      var tabsCount = line.text.substr(0, firstNonSpace).replace(/[^\t]/g, "").length;
      var off = ((firstNonSpace - tabsCount) + (tabsCount * cm.getOption("tabSize"))) * cm.defaultCharWidth();
      var compStyle = window.getComputedStyle(elt, null),
          textIndent = "-" + off + "px",
          paddingLeft = off + "px";
      if (textIndent != compStyle["text-indent"]) {
        elt.style.textIndent = textIndent;
        changedSomething = true;
      }
      if (paddingLeft != compStyle["padding-left"]) {
        elt.style.paddingLeft = paddingLeft;
        changedSomething = true;
      }
    });
    if (changedSomething || forceRefresh) {
      editor.refresh();
    }
  }

  var AppInit = brackets.getModule("utils/AppInit"),
      EditorManager = brackets.getModule("editor/EditorManager");

  AppInit.appReady(function () {
    handleEditor(EditorManager.getCurrentFullEditor(), true); // Force refresh when started
    $(EditorManager).on("activeEditorChange", function (event, focusedEditor, lostEditor) {
      handleEditor(focusedEditor, false);
    });
  });
});
