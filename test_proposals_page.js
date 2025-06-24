/**
 * Proposals Page Testing Script
 * 
 * This script tests the proposals page functionality
 * Run this in the browser console on the proposals page
 */

console.log('🧪 Starting Proposals Page Tests...');

// Test 1: Check if all required functions exist
function testFunctionExistence() {
  console.log('\n📋 Test 1: Function Existence');
  
  const requiredFunctions = [
    'loadStatistics',
    'loadProposals', 
    'renderProposals',
    'filterProposals',
    'getStatusColor',
    'viewProposal',
    'showProposalModal',
    'showModal',
    'hideModal',
    'executeProposal',
    'rejectProposal',
    'showNotification'
  ];
  
  let allFunctionsExist = true;
  
  requiredFunctions.forEach(funcName => {
    if (typeof window[funcName] === 'function') {
      console.log(`✅ ${funcName} exists`);
    } else {
      console.log(`❌ ${funcName} missing`);
      allFunctionsExist = false;
    }
  });
  
  return allFunctionsExist;
}

// Test 2: Check if DOM elements exist
function testDOMElements() {
  console.log('\n🎯 Test 2: DOM Elements');
  
  const requiredElements = [
    'proposals-list',
    'proposal-modal',
    'modal-title',
    'modal-content',
    'modal-actions',
    'close-modal',
    'refresh-btn',
    'status-filter',
    'type-filter',
    'test-btn'
  ];
  
  let allElementsExist = true;
  
  requiredElements.forEach(elementId => {
    const element = document.getElementById(elementId);
    if (element) {
      console.log(`✅ ${elementId} exists`);
    } else {
      console.log(`❌ ${elementId} missing`);
      allElementsExist = false;
    }
  });
  
  return allElementsExist;
}

// Test 3: Check if proposals data is loaded
function testProposalsData() {
  console.log('\n📊 Test 3: Proposals Data');
  
  if (typeof proposals !== 'undefined' && Array.isArray(proposals)) {
    console.log(`✅ Proposals array exists with ${proposals.length} items`);
    
    proposals.forEach((proposal, index) => {
      console.log(`  📋 Proposal ${index + 1}: ${proposal.summary} (${proposal.status})`);
    });
    
    return true;
  } else {
    console.log('❌ Proposals data not loaded');
    return false;
  }
}

// Test 4: Test button rendering
function testButtonRendering() {
  console.log('\n🔘 Test 4: Button Rendering');
  
  const proposalElements = document.querySelectorAll('#proposals-list > div');
  console.log(`Found ${proposalElements.length} proposal elements`);
  
  proposalElements.forEach((element, index) => {
    const buttons = element.querySelectorAll('button');
    console.log(`  Proposal ${index + 1}: ${buttons.length} buttons`);
    
    buttons.forEach(button => {
      console.log(`    - ${button.textContent.trim()} (${button.className.includes('bg-blue') ? 'Details' : button.className.includes('bg-green') ? 'Accept' : button.className.includes('bg-red') ? 'Reject' : 'Unknown'})`);
    });
  });
  
  return proposalElements.length > 0;
}

// Test 5: Test button click handlers
function testButtonClickHandlers() {
  console.log('\n🖱️ Test 5: Button Click Handlers');
  
  const proposalElements = document.querySelectorAll('#proposals-list > div');
  let testResults = [];
  
  proposalElements.forEach((element, index) => {
    const buttons = element.querySelectorAll('button');
    
    buttons.forEach(button => {
      const buttonText = button.textContent.trim();
      const hasOnClick = button.hasAttribute('onclick');
      
      console.log(`  Proposal ${index + 1} - ${buttonText}: ${hasOnClick ? '✅ Has onclick' : '❌ No onclick'}`);
      testResults.push(hasOnClick);
    });
  });
  
  return testResults.every(result => result);
}

// Test 6: Test modal functionality
function testModalFunctionality() {
  console.log('\n📋 Test 6: Modal Functionality');
  
  const modal = document.getElementById('proposal-modal');
  if (!modal) {
    console.log('❌ Modal element not found');
    return false;
  }
  
  const isHidden = modal.classList.contains('hidden');
  console.log(`Modal is ${isHidden ? 'hidden' : 'visible'}`);
  
  // Test if we can show/hide modal
  try {
    showModal();
    console.log('✅ showModal() works');
    
    hideModal();
    console.log('✅ hideModal() works');
    
    return true;
  } catch (error) {
    console.log('❌ Modal functions failed:', error);
    return false;
  }
}

// Test 7: Test notification system
function testNotificationSystem() {
  console.log('\n🔔 Test 7: Notification System');
  
  try {
    showNotification('Test notification', 'info');
    console.log('✅ showNotification() works');
    return true;
  } catch (error) {
    console.log('❌ showNotification() failed:', error);
    return false;
  }
}

// Test 8: Test proposal actions
function testProposalActions() {
  console.log('\n⚡ Test 8: Proposal Actions');
  
  if (typeof proposals === 'undefined' || proposals.length === 0) {
    console.log('❌ No proposals to test');
    return false;
  }
  
  const firstProposal = proposals[0];
  console.log(`Testing with proposal: ${firstProposal.proposal_id}`);
  
  // Test viewProposal
  try {
    viewProposal(firstProposal.proposal_id);
    console.log('✅ viewProposal() works');
    
    // Close modal
    hideModal();
    
    return true;
  } catch (error) {
    console.log('❌ viewProposal() failed:', error);
    return false;
  }
}

// Test 9: Test filters
function testFilters() {
  console.log('\n🔍 Test 9: Filters');
  
  const statusFilter = document.getElementById('status-filter');
  const typeFilter = document.getElementById('type-filter');
  
  if (statusFilter && typeFilter) {
    console.log('✅ Filter elements exist');
    
    // Test filter function
    try {
      const originalCount = proposals.length;
      filterProposals();
      console.log('✅ filterProposals() works');
      return true;
    } catch (error) {
      console.log('❌ filterProposals() failed:', error);
      return false;
    }
  } else {
    console.log('❌ Filter elements missing');
    return false;
  }
}

// Run all tests
function runAllTests() {
  console.log('🧪 Running all tests...\n');
  
  const tests = [
    { name: 'Function Existence', test: testFunctionExistence },
    { name: 'DOM Elements', test: testDOMElements },
    { name: 'Proposals Data', test: testProposalsData },
    { name: 'Button Rendering', test: testButtonRendering },
    { name: 'Button Click Handlers', test: testButtonClickHandlers },
    { name: 'Modal Functionality', test: testModalFunctionality },
    { name: 'Notification System', test: testNotificationSystem },
    { name: 'Proposal Actions', test: testProposalActions },
    { name: 'Filters', test: testFilters }
  ];
  
  const results = tests.map(test => ({
    name: test.name,
    passed: test.test()
  }));
  
  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  
  results.forEach(result => {
    console.log(`${result.passed ? '✅' : '❌'} ${result.name}`);
  });
  
  const passedTests = results.filter(r => r.passed).length;
  const totalTests = results.length;
  
  console.log(`\n🎯 Overall: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! The proposals page is working correctly.');
  } else {
    console.log('⚠️ Some tests failed. Check the console for details.');
  }
  
  return results;
}

// Manual test functions
function manualTestDetails() {
  console.log('🔍 Manual Test: Details Button');
  const detailsButtons = document.querySelectorAll('#proposals-list button');
  if (detailsButtons.length > 0) {
    console.log('Clicking first Details button...');
    detailsButtons[0].click();
  } else {
    console.log('No Details buttons found');
  }
}

function manualTestAccept() {
  console.log('✅ Manual Test: Accept Button');
  const acceptButtons = document.querySelectorAll('#proposals-list button.bg-green-600');
  if (acceptButtons.length > 0) {
    console.log('Clicking first Accept button...');
    acceptButtons[0].click();
  } else {
    console.log('No Accept buttons found');
  }
}

function manualTestReject() {
  console.log('❌ Manual Test: Reject Button');
  const rejectButtons = document.querySelectorAll('#proposals-list button.bg-red-600');
  if (rejectButtons.length > 0) {
    console.log('Clicking first Reject button...');
    rejectButtons[0].click();
  } else {
    console.log('No Reject buttons found');
  }
}

// Export test functions for manual use
window.proposalTests = {
  runAllTests,
  manualTestDetails,
  manualTestAccept,
  manualTestReject,
  testFunctionExistence,
  testDOMElements,
  testProposalsData,
  testButtonRendering,
  testButtonClickHandlers,
  testModalFunctionality,
  testNotificationSystem,
  testProposalActions,
  testFilters
};

console.log('🧪 Testing script loaded!');
console.log('Run proposalTests.runAllTests() to run all tests');
console.log('Or run individual tests like proposalTests.manualTestDetails()'); 