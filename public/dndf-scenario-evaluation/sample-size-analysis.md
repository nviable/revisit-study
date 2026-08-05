# Sample Size Analysis for Scenario Evaluation Study

## Study Configuration Overview

- **Total Scenarios**: 6 scenarios
- **Scenarios per Participant**: 3 scenarios (via `numSamples: 3`)
- **Randomization**: Latin square (balances position order)
- **Questions per Scenario**: 14 total
  - 2 short text (understanding/comprehension checks)
  - 10 Likert scales (5-point: Strongly Disagree to Strongly Agree)
  - 2 long text (open-ended qualitative questions)

## Qualitative Analysis Requirements

### Data Structure
- **Open-ended questions per scenario**: 2
  - "What is the strongest aspect of the scenario as a training tool for journalists?"
  - "What is the weakest aspect of the scenario as a training tool for journalists?"
- **Open-ended responses per participant**: 6 (3 scenarios × 2 questions)

### Saturation Requirements

For qualitative thematic analysis, you typically need:
- **3-5 responses per open-ended question** to identify themes
- **5-8 responses** for more confidence and pattern validation

### Participant Requirements for Qualitative Analysis

| Participants | Evaluations per Scenario | Open-Ended Responses per Question | Total Open-Ended Responses | Assessment |
|-------------|-------------------------|----------------------------------|---------------------------|------------|
| **4** | ~2 | ~4 | 24 | Insufficient |
| **6** | ~3 | ~6 | 36 | **Minimum** |
| **8** | ~4 | ~8 | 48 | **Recommended** |
| **10** | ~5 | ~10 | 60 | Ideal |

### Qualitative Analysis Recommendations

- **Minimum**: **6 participants** (~6 responses per open-ended question per scenario)
  - Sufficient for initial theme identification
  - May be tight if some responses are brief or low-quality

- **Recommended**: **8 participants** (~8 responses per open-ended question per scenario)
  - Better for saturation and pattern validation
  - Handles variation in response quality
  - More robust for identifying nuanced themes

- **Ideal**: **10 participants** (~10 responses per open-ended question per scenario)
  - Strong saturation
  - More robust for identifying nuanced themes
  - Better handles outliers and low-quality responses

### Additional Qualitative Considerations

1. **Response Quality**: If responses are brief or superficial, you may need more participants
2. **Likert Data Support**: The 10 Likert scales per scenario provide quantitative support for qualitative themes
3. **Understanding Questions**: The 2 comprehension checks help filter low-quality responses

---

## Quantitative Analysis Requirements

### Data Structure
- **Likert scales per scenario**: 10 (5-point scales)
- **Likert responses per scenario evaluation**: 10
- **Total quantitative data points per participant**: 30 (3 scenarios × 10 Likert scales)

### Sample Size Requirements by Analysis Type

#### 1. Descriptive Statistics (Means, Standard Deviations)

| Participants | Evaluations per Scenario | Likert Responses per Scenario | Reliability |
|-------------|-------------------------|------------------------------|-------------|
| **10** | ~5 | ~50 | Minimal (unreliable means) |
| **20** | ~10 | ~100 | Basic (rough estimates) |
| **30** | ~15 | ~150 | Moderate (reasonable estimates) |
| **40** | ~20 | ~200 | Good (reliable estimates) |
| **60** | ~30 | ~300 | Strong (robust estimates) |

#### 2. Inferential Statistics (Comparing Scenarios)

**For t-tests or ANOVA comparing scenarios:**
- **Minimum**: 15-20 evaluations per scenario → **30-40 participants**
- **Recommended**: 20-30 evaluations per scenario → **40-60 participants**
- **Ideal**: 30+ evaluations per scenario → **60+ participants**

**For multiple comparisons** (6 scenarios = 15 pairwise comparisons):
- **Minimum**: 20-25 evaluations per scenario → **40-50 participants**
- **Recommended**: 25-30 evaluations per scenario → **50-60 participants**

#### 3. Statistical Power Considerations

**For detecting medium effect sizes** (Cohen's d = 0.5) with 80% power:
- **t-tests**: ~25-30 per group → **50-60 participants**
- **ANOVA (6 groups)**: ~20-25 per group → **40-50 participants**

**For detecting small effect sizes** (Cohen's d = 0.3):
- **t-tests**: ~60-70 per group → **120-140 participants**
- **ANOVA**: ~50-60 per group → **100-120 participants**

### Quantitative Analysis Recommendations by Goal

| Analysis Goal | Participants Needed | Evaluations per Scenario | Likert Responses per Scenario |
|--------------|-------------------|-------------------------|------------------------------|
| **Descriptive stats only** | 20-30 | 10-15 | 100-150 |
| **Basic comparisons** | 40-50 | 20-25 | 200-250 |
| **Robust comparisons** | 60-80 | 30-40 | 300-400 |
| **Small effect detection** | 100-120 | 50-60 | 500-600 |

### Detailed Recommendations

#### Minimal Quantitative Analysis (Descriptive Only)
- **20-30 participants** (~10-15 evaluations per scenario)
- Can calculate means and standard deviations
- Limited inferential statistics
- Suitable for exploratory analysis

#### Basic Quantitative Analysis (Descriptive + Basic Comparisons)
- **40-50 participants** (~20-25 evaluations per scenario)
- Can run t-tests and ANOVA
- Reasonable power for medium effects
- Can handle multiple comparisons with corrections (Bonferroni, FDR)

#### Robust Quantitative Analysis (Full Statistical Analysis)
- **60-80 participants** (~30-40 evaluations per scenario)
- Strong statistical power
- Reliable means and standard deviations
- Can detect smaller effect sizes
- Robust to outliers and missing data

### Important Quantitative Considerations

1. **Missing Data**: Likert questions are `required: false`, so plan for some missing responses
2. **Multiple Dimensions**: You have 10 different Likert scales, so you're analyzing 10 dependent variables
3. **Latin Square Balance**: Distribution should be reasonably balanced, but some scenarios may have slightly more/fewer evaluations
4. **Multiple Comparisons**: With 6 scenarios, you have 15 possible pairwise comparisons - need to account for multiple testing corrections

---

## Summary Recommendations

### For Qualitative Analysis Only
- **Minimum**: 6 participants
- **Recommended**: 8 participants
- **Ideal**: 10 participants

### For Quantitative Analysis Only
- **Minimum (descriptive)**: 20-30 participants
- **Recommended (basic comparisons)**: 40-50 participants
- **Ideal (robust analysis)**: 60-80 participants

### For Mixed Methods (Both Qualitative and Quantitative)
- **Minimum**: 20-30 participants (qualitative may be limited)
- **Recommended**: 40-50 participants (good balance)
- **Ideal**: 60-80 participants (robust for both)

### Bottom Line

- **Qualitative focus**: Aim for **6-8 participants minimum (8 recommended)** for robust qualitative saturation
- **Quantitative focus**: Aim for **40-60 participants (20-30 evaluations per scenario)** for meaningful quantitative analysis with good statistical power
- **Mixed methods**: **40-50 participants** provides a good balance, with **60-80 participants** being ideal for robust analysis of both types

---

## Notes on Latin Square Randomization

The study uses Latin square randomization with `numSamples: 3`, which:
- Ensures each component appears equally in each position (1st, 2nd, 3rd)
- Does NOT guarantee equal frequency of scenarios across participants
- Should provide reasonably balanced distribution, but some scenarios may appear slightly more/less often
- Consider monitoring actual distribution after data collection to verify balance

---

*Generated: Analysis of sample size requirements for qualitative and quantitative analysis of scenario evaluation study*

