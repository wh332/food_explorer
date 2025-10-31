// 测试菜系详情页面数据库连接
const testCuisineDetails = async () => {
  console.log('=== 测试川鲁粤三个菜系的数据库连接 ===\n');
  
  // 川菜、粤菜、鲁菜的ID（从数据库查询结果中获取）
  const cuisineIds = [
    '5af34327-5837-4fae-bcdd-69093f3a36fb', // 川菜
    '36149d41-f758-482b-b650-474e8b1e6b57', // 粤菜  
    '2263acb5-84a6-43b5-bad2-4b0668620830'  // 鲁菜
  ];
  
  const cuisineNames = ['川菜', '粤菜', '鲁菜'];
  
  for (let i = 0; i < cuisineIds.length; i++) {
    const cuisineId = cuisineIds[i];
    const cuisineName = cuisineNames[i];
    
    console.log(`\n--- 测试 ${cuisineName} 详情页面 ---`);
    
    try {
      // 模拟菜系详情页面的数据库查询
      const response = await fetch(
        `https://frodvnbyjnoiwyobklhp.supabase.co/rest/v1/cuisine_data?id=eq.${cuisineId}`,
        {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyb2R2bmJ5am5vaXd5b2JrbGhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2MzI0NzcsImV4cCI6MjA3NzIwODQ3N30.9SnLhaF2at5-NJShMKWaSF_iJ3tg-m-JBvfAoD0JJN8',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyb2R2bmJ5am5vaXd5b2JrbGhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2MzI0NzcsImV4cCI6MjA3NzIwODQ3N30.9SnLhaF2at5-NJShMKWaSF_iJ3tg-m-JBvfAoD0JJN8'
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ ${cuisineName} 数据加载成功:`);
        console.log(`   - 名称: ${data[0]?.name}`);
        console.log(`   - 描述: ${data[0]?.description}`);
        console.log(`   - 特色: ${data[0]?.characteristics?.join(', ')}`);
        console.log(`   - 代表菜品: ${data[0]?.representative_dishes?.join(', ')}`);
        
        // 测试相关菜品查询
        const dishesResponse = await fetch(
          `https://frodvnbyjnoiwyobklhp.supabase.co/rest/v1/dish_data?cuisine_name=eq.${cuisineName}&limit=3`,
          {
            headers: {
              'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyb2R2bmJ5am5vaXd5b2JrbGhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2MzI0NzcsImV4cCI6MjA3NzIwODQ3N30.9SnLhaF2at5-NJShMKWaSF_iJ3tg-m-JBvfAoD0JJN8',
              'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyb2R2bmJ5am5vaXd5b2JrbGhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2MzI0NzcsImV4cCI6MjA3NzIwODQ3N30.9SnLhaF2at5-NJShMKWaSF_iJ3tg-m-JBvfAoD0JJN8'
            }
          }
        );
        
        if (dishesResponse.ok) {
          const dishesData = await dishesResponse.json();
          console.log(`   - 相关菜品数量: ${dishesData.length}`);
          dishesData.forEach(dish => {
            console.log(`     * ${dish.name} (${dish.difficulty}, ${dish.time_required})`);
          });
        }
      } else {
        console.log(`❌ ${cuisineName} 数据加载失败: ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${cuisineName} 连接错误: ${error.message}`);
    }
  }
  
  console.log('\n=== 测试完成 ===');
};

// 执行测试
testCuisineDetails();