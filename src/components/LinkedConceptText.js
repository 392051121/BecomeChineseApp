import React, { useMemo, useState, useCallback } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { getAllCulturalConcepts } from './ConceptExplainer';
import { getCulturalConcept } from './ConceptExplainer';
import { ConceptExplainerCard } from './ConceptExplainer';
import { useTheme } from '../theme/ThemeContext';

// ---------------------------------------------------------------------------
// Pure text -> linked-segments parser (unit-testable, no React needed)
// ---------------------------------------------------------------------------

/**
 * Split a body of text into segments, marking the spans that correspond to a
 * known cultural concept. Plain and linked spans are returned in order so a
 * renderer can turn each linked span into a glossary lookup.
 *
 * Matching rules:
 *  - English labels match on **word boundaries** (so "Harmony" links in
 *    "Harmony and ..." but NOT in "Harmonious").
 *  - Chinese labels match as exact substrings (CJK has no word boundaries).
 *  - When concepts overlap on the same index, the longest span wins to avoid
 *    double-wrapping.
 *
 * @param {string|undefined} text
 * @param {Array<string>|undefined} conceptKeys Optional allow-list of concept
 *   keys to link in this text. Defaults to the whole glossary.
 * @returns {Array<{text:string, conceptKey:string|null}>}
 */
export function parseConceptLinks(text, conceptKeys) {
  if (!text || typeof text !== 'string' || text.length === 0) {
    return [{ text: typeof text === 'string' ? text : '', conceptKey: null }];
  }

  const allConcepts = getAllCulturalConcepts();
  const source = conceptKeys && conceptKeys.length > 0
    ? allConcepts.filter((c) => conceptKeys.includes(c.key))
    : allConcepts;

  // Collect candidate spans { start, end, conceptKey }.
  const spans = [];
  source.forEach((c) => {
    // English label -> word boundary match
    const enRegex = new RegExp(`\\b${escapeRegExp(c.english)}\\b`, 'gi');
    let m;
    while ((m = enRegex.exec(text)) !== null) {
      if (m[0].length > 0) {
        spans.push({ s: m.index, e: m.index + m[0].length, conceptKey: c.key });
      }
      if (m[0].length === 0) enRegex.lastIndex++;
    }
    // Chinese label -> exact substring match
    if (c.chinese) {
      let idx = text.indexOf(c.chinese);
      while (idx !== -1) {
        spans.push({ s: idx, e: idx + c.chinese.length, conceptKey: c.key });
        idx = text.indexOf(c.chinese, idx + Math.max(1, c.chinese.length));
      }
    }
  });

  if (spans.length === 0) {
    return [{ text, conceptKey: null }];
  }

  // Sort by start asc, then by length desc so the longest candidate at a
  // position is considered first.
  spans.sort((a, b) => a.s - b.s || (b.e - b.s) - (a.e - a.s) || a.conceptKey.localeCompare(b.conceptKey));

  // Resolve overlaps into non-overlapping segments covering the text.
  const resolved = [];
  for (const span of spans) {
    const last = resolved[resolved.length - 1];
    if (!last || span.s >= last.e) {
      resolved.push(span);
      continue;
    }
    if (span.s > last.s && (span.e - span.s) > (last.e - last.s)) {
      resolved[resolved.length - 1] = span;
    }
  }

  // Cut the text into plain / linked segments.
  const segments = [];
  let cursor = 0;
  for (const span of resolved) {
    if (span.s > cursor) {
      segments.push({ text: text.slice(cursor, span.s), conceptKey: null });
    }
    segments.push({ text: text.slice(span.s, span.e), conceptKey: span.conceptKey });
    cursor = span.e;
  }
  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), conceptKey: null });
  }

  return segments;
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ---------------------------------------------------------------------------
// Renderer
// ---------------------------------------------------------------------------

/**
 * Renders a paragraph, automatically turning recognised cultural concepts into
 * tappable glossary links. Tapping a link opens a small modal showing the full
 * ConceptExplainerCard for that term — a "wiki-link" lookup without leaving the
 * page. Plain text that matches no concept renders unchanged.
 *
 * The whole thing is built from <Text within <Text>, which is the one nesting
 * React Native allows inside wrapped paragraphs, so line-breaking and style
 * inheritance are preserved exactly like the original plain <Text>.
 */
export function LinkedConceptText({
  text,
  conceptKeys,
  style,
  linkStyle,
  numberOfLines,
  onConceptPress,
}) {
  const { colors } = useTheme();
  const [activeKey, setActiveKey] = useState(null);

  const segments = useMemo(() => parseConceptLinks(text, conceptKeys), [text, conceptKeys]);

  const handlePress = useCallback((key) => {
    if (onConceptPress) {
      onConceptPress(key);
    } else {
      setActiveKey(key);
    }
  }, [onConceptPress]);

  const activeConcept = activeKey ? getCulturalConcept(activeKey) : null;

  return (
    <>
      <Text style={[styles.base, style]} numberOfLines={numberOfLines}>
        {segments.map((seg, index) =>
          seg.conceptKey ? (
            <Text
              key={index}
              onPress={() => handlePress(seg.conceptKey)}
              style={[styles.link, { color: colors.primary, borderBottomColor: colors.primary }, linkStyle]}
            >
              {seg.text}
            </Text>
          ) : (
            <Text key={index}>{seg.text}</Text>
          )
        )}
      </Text>

      {activeConcept && !onConceptPress && (
        <Modal
          visible
          transparent
          animationType="fade"
          onRequestClose={() => setActiveKey(null)}
        >
          <Pressable style={styles.backdrop} onPress={() => setActiveKey(null)}>
            <Pressable style={[styles.modalCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <ConceptExplainerCard
                concept={activeConcept}
                showWesternEquivalent={false}
                onDismiss={() => setActiveKey(null)}
              />
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  base: {
    fontSize: 14,
    lineHeight: 21,
  },
  link: {
    fontWeight: '700',
    borderBottomWidth: 1,
    borderBottomStyle: 'dotted',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    borderRadius: 18,
    borderWidth: 0.5,
    paddingVertical: 4,
    maxHeight: '75%',
  },
});
