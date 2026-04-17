import React, { memo, useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { recipes } from '../data/recipes';
import { SmartImageBlock } from '../components/SmartImageBlock';
import { getLocalImage } from '../assets/localImages';
import { toggleCollectionItem } from '../utils/culturalAssets';
import { theme } from '../theme/theme';

const RecipeCard = memo(function RecipeCard({ item, index, onPress }) {
  const isLeftCard = index % 2 === 0;
  return (
    <Pressable
      onPress={() => onPress(item)}
      style={[styles.card, isLeftCard ? styles.leftCard : styles.rightCard]}
    >
      <View style={styles.imageWrap}>
        <SmartImageBlock
          source={getLocalImage('recipes', item.imageAsset)}
          uri={item.image}
          label={item.imagePlaceholderText}
          style={styles.placeholderImage}
          overlayOpacity={0.1}
        />
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.nameEn} numberOfLines={2}>
          {item.nameEn.toUpperCase()}
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.nameZh}>{item.nameZh}</Text>
          <Text style={styles.difficulty}>{item.difficulty}</Text>
        </View>
        <Text style={styles.prepTime}>{item.prepTime}</Text>
      </View>
    </Pressable>
  );
});

export function FoodScreen() {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const data = useMemo(() => recipes, []);
  const [bookmarked, setBookmarked] = useState({});

  const onOpenRecipe = useCallback((item) => setSelectedRecipe(item), []);
  const onToggleBookmark = useCallback(async (item) => {
    setBookmarked((prev) => ({ ...prev, [item.id]: !prev[item.id] }));
    await toggleCollectionItem('recipes', {
      id: item.id,
      nameEn: item.nameEn,
      province: item.province,
      imageAsset: item.imageAsset,
      culturalStory: item.culturalStory,
    }).catch(() => {});
  }, []);
  const renderRecipeCard = useCallback(
    ({ item, index }) => <RecipeCard item={item} index={index} onPress={onOpenRecipe} />,
    [onOpenRecipe]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Chinese Food</Text>
        <Text style={styles.subtitle}>Explore China’s regional cuisines, home cooking, seasonal dishes, and everyday table culture.</Text>
        <View style={styles.titleDivider} />

        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          numColumns={2}
          renderItem={renderRecipeCard}
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          updateCellsBatchingPeriod={40}
          windowSize={8}
          removeClippedSubviews
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.column}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <Modal
        visible={!!selectedRecipe}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedRecipe(null)}
      >
        <Pressable style={styles.backdrop} onPress={() => setSelectedRecipe(null)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            {selectedRecipe ? (
              <>
                <View style={styles.sheetHandle} />
                <Text style={styles.sheetTitle}>{selectedRecipe.nameEn}</Text>
                <Text style={styles.sheetTitleZh}>{selectedRecipe.nameZh}</Text>

                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>Cultural Story / 饮食故事</Text>
                  <Text style={styles.sectionText}>{selectedRecipe.culturalStory}</Text>
                </View>

                <View style={styles.sectionRow}>
                  <View style={styles.sectionHalf}>
                    <Text style={styles.sectionLabel}>Home Version / 家庭替代做法</Text>
                    <Text style={styles.sectionText}>{selectedRecipe.substitution}</Text>
                  </View>
                  <View style={styles.sectionHalf}>
                    <Text style={styles.sectionLabel}>Region / 所属地区</Text>
                    <Text style={styles.sectionText}>{selectedRecipe.province}</Text>
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>Context / 饮食语境</Text>
                  <Text style={styles.sectionText}>{selectedRecipe.culturalContext}</Text>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>Table Note / 餐桌注释</Text>
                  <Text style={styles.sectionText}>
                    A local collectible card for understanding Chinese home cooking, regional dishes, seasonal food, and how meals shape social life.
                  </Text>
                </View>

                <View style={styles.section}>
                  <Pressable
                    style={[styles.saveBtn, bookmarked[selectedRecipe.id] && styles.saveBtnActive]}
                    onPress={() => onToggleBookmark(selectedRecipe)}
                  >
                    <Text style={[styles.saveBtnText, bookmarked[selectedRecipe.id] && styles.saveBtnTextActive]}>
                      {bookmarked[selectedRecipe.id] ? 'Saved' : 'Save'}
                    </Text>
                  </Pressable>
                </View>
              </>
            ) : null}
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  title: {
    color: theme.colors.text,
    fontSize: 28,
    letterSpacing: 0.4,
    fontWeight: '600',
  },
  subtitle: {
    color: theme.colors.mutedText,
    marginTop: 6,
    marginBottom: 16,
    fontSize: 13,
    lineHeight: 20.8,
    letterSpacing: 0.2,
  },
  titleDivider: {
    height: 0.5,
    backgroundColor: theme.colors.border,
    marginBottom: 14,
  },
  listContent: {
    paddingBottom: 28,
  },
  column: {
    justifyContent: 'space-between',
    gap: 12,
  },
  card: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1.5,
  },
  leftCard: {
    marginRight: 6,
  },
  rightCard: {
    marginLeft: 6,
  },
  imageWrap: {
    width: '100%',
    aspectRatio: 1,
    flex: 7,
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#EFE8DA',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.border,
  },
  placeholderText: {
    color: theme.colors.text,
    opacity: 0.6,
    fontSize: 12,
    letterSpacing: 0.3,
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  cardBody: {
    flex: 3,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopWidth: 0.5,
    borderTopColor: theme.colors.border,
    minHeight: 92,
  },
  nameEn: {
    color: theme.colors.text,
    fontSize: 12,
    lineHeight: 19,
    letterSpacing: 0.6,
    fontWeight: '700',
    minHeight: 34,
  },
  metaRow: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  nameZh: {
    color: theme.colors.mutedText,
    fontSize: 12,
    lineHeight: 19,
  },
  difficulty: {
    color: theme.colors.primary,
    fontSize: 11,
    letterSpacing: 0.2,
    fontWeight: '700',
  },
  prepTime: {
    marginTop: 6,
    color: theme.colors.mutedText,
    fontSize: 11,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.28)',
    justifyContent: 'flex-end',
  },
  sheet: {
    minHeight: '52%',
    maxHeight: '72%',
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 26,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 44,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(51, 51, 51, 0.22)',
    marginBottom: 12,
  },
  sheetTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  sheetTitleZh: {
    marginTop: 4,
    color: theme.colors.mutedText,
    fontSize: 14,
    marginBottom: 14,
  },
  section: {
    borderTopWidth: 0.5,
    borderTopColor: theme.colors.border,
    paddingTop: 12,
    marginTop: 8,
  },
  sectionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  sectionHalf: {
    flex: 1,
    gap: 4,
  },
  sectionLabel: {
    color: theme.colors.primary,
    fontSize: 12,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    fontWeight: '700',
    marginBottom: 7,
  },
  sectionText: {
    color: theme.colors.text,
    fontSize: 14,
    lineHeight: 22.4,
    letterSpacing: 0.2,
  },
  saveBtn: {
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveBtnActive: {
    backgroundColor: theme.colors.background,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  saveBtnTextActive: {
    color: theme.colors.primary,
  },
});
