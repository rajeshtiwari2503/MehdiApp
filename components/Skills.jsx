import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
 
 

const Skills = () => {
  // const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
     
  }, []);

  const skills=[
    {
      _id:1,
      title:"title ",
      description:"title ",
      videoUrl:"title ",
    }
  ]

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Skills</Text>
      <FlatList
        data={skills}
        renderItem={({ item }) =>  <View style={styles.containerSkill}>
        <Text style={styles.title}>{item?.title}</Text>
        <Text style={styles.description}>{item?.description}</Text>
        <Text style={styles.video}>{item?.description}</Text>
        {/* {skill.videoUrl ? (
          <Video
            source={{ uri: skill?.videoUrl }}
            style={styles.video}
            controls={true}
          />
        ) : null} */}
      </View>}
        keyExtractor={item => item?._id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  containerSkill: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    // width:300
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8
  },
  description: {
    fontSize: 14,
    marginBottom: 8
  },
  video: {
    height: 200,
    width: '100%',
    marginTop: 10
  }
});

export default Skills;
