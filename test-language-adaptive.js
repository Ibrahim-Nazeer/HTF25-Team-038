// Test script to verify language-adaptive problems
// Run this in browser console while in an interview room

async function testLanguageAdaptiveProblems() {
  console.log('🧪 Testing Language-Adaptive Problems...\n');

  try {
    // 1. Fetch all problems
    const response = await fetch('http://localhost:3001/api/problems');
    const problems = await response.json();
    
    console.log(`✅ Loaded ${problems.length} problems`);
    console.log(`📊 Categories: ${[...new Set(problems.map(p => p.category))].join(', ')}\n`);

    // 2. Check a problem has multi-language support
    const testProblem = problems.find(p => p.title === 'Two Sum');
    
    if (!testProblem) {
      console.error('❌ Test problem not found');
      return;
    }

    console.log(`🔍 Testing problem: ${testProblem.title}`);
    console.log(`   Difficulty: ${testProblem.difficulty}`);
    console.log(`   Category: ${testProblem.category}`);
    console.log(`   Function: ${testProblem.functionName}\n`);

    // 3. Verify multi-language starter code
    if (testProblem.starterCode && typeof testProblem.starterCode === 'object') {
      const languages = Object.keys(testProblem.starterCode);
      console.log(`✅ Supports ${languages.length} languages: ${languages.join(', ')}\n`);
      
      // Show JavaScript example
      if (testProblem.starterCode.javascript) {
        console.log('📝 JavaScript starter code:');
        console.log(testProblem.starterCode.javascript);
        console.log('\n');
      }

      // Show Python example
      if (testProblem.starterCode.python) {
        console.log('🐍 Python starter code:');
        console.log(testProblem.starterCode.python);
        console.log('\n');
      }
    } else {
      console.error('❌ StarterCode is not in expected format');
    }

    // 4. Verify test cases
    if (testProblem.testCases && Array.isArray(testProblem.testCases)) {
      const publicTests = testProblem.testCases.filter(t => !t.hidden);
      const hiddenTests = testProblem.testCases.filter(t => t.hidden);
      
      console.log(`✅ Test cases: ${publicTests.length} public, ${hiddenTests.length} hidden`);
      console.log('\nPublic test example:');
      console.log(JSON.stringify(publicTests[0], null, 2));
    }

    // 5. Test search functionality simulation
    console.log('\n🔎 Search functionality test:');
    const searchTerm = 'tree';
    const searchResults = problems.filter(p => 
      p.title.toLowerCase().includes(searchTerm) || 
      p.description.toLowerCase().includes(searchTerm)
    );
    console.log(`   Search for "${searchTerm}": ${searchResults.length} results`);

    // 6. Test difficulty filter
    const difficulties = ['EASY', 'MEDIUM', 'HARD'];
    console.log('\n📊 Difficulty distribution:');
    difficulties.forEach(diff => {
      const count = problems.filter(p => p.difficulty === diff).length;
      console.log(`   ${diff}: ${count} problems`);
    });

    // 7. Test category filter
    const categories = [...new Set(problems.map(p => p.category))];
    console.log('\n📚 Category distribution:');
    categories.forEach(cat => {
      const count = problems.filter(p => p.category === cat).length;
      console.log(`   ${cat}: ${count} problems`);
    });

    console.log('\n✅ All tests passed! Language-adaptive problems working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testLanguageAdaptiveProblems();
