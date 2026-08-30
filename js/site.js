// site.js — EITools 首页增强：最近使用 / 我的收藏 渲染
// 依赖：js/share.js（先加载，提供 localStorage 键约定）
(function () {
  'use strict';
  var RECENT_KEY = 'ei-recent', FAV_KEY = 'ei-favs';
  function ls(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function parse(k) { try { return JSON.parse(ls(k) || '[]'); } catch (e) { return []; } }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function renderChips(rowEl, list, removable) {
    rowEl.innerHTML = list.map(function (x) {
      var close = removable
        ? ' <span class="chip-x" data-remove="' + esc(x.file) + '" title="移除">×</span>'
        : '';
      var href = x.link || ('/src/tools/' + x.file);
      return '<a class="chip" href="' + esc(href) + '">' + esc(x.name) + close + '</a>';
    }).join('');
    if (removable) {
      rowEl.querySelectorAll('[data-remove]').forEach(function (el) {
        el.onclick = function (e) {
          e.preventDefault();
          e.stopPropagation();
          var f = el.getAttribute('data-remove');
          var favs = parse(FAV_KEY).filter(function (x) { return x.file !== f; });
          lsSet(FAV_KEY, JSON.stringify(favs));
          render();
        };
      });
    }
  }

  function render() {
    var recentRow = document.getElementById('recent-row');
    var favRow = document.getElementById('fav-row');
    var recentSec = document.getElementById('recent-section');
    var favSec = document.getElementById('fav-section');

    var recent = parse(RECENT_KEY);
    if (recentSec) {
      if (recent.length) {
        recentSec.style.display = '';
        if (recentRow) renderChips(recentRow, recent.slice(0, 8), false);
      } else {
        recentSec.style.display = 'none';
      }
    }

    var favs = parse(FAV_KEY);
    if (favSec) {
      if (favs.length) {
        favSec.style.display = '';
        if (favRow) renderChips(favRow, favs.slice(0, 12), true);
      } else {
        favSec.style.display = 'none';
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
