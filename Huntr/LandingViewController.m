//
//  LandingViewController.m
//  Huntr
//
//  Created by Millie Chan on 9/5/16.
//  Copyright © 2016 Edward Kim. All rights reserved.
//

#import "LandingViewController.h"

@interface LandingViewController ()

@end

@implementation LandingViewController


- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    NSLog(@"Made it here!!");
    NSError *error;
    NSString *url_string = [NSString stringWithFormat: @"https://protected-anchorage-46542.herokuapp.com/users/2/games"];
    NSData *data = [NSData dataWithContentsOfURL: [NSURL URLWithString:url_string]];
    NSMutableArray *json = [NSJSONSerialization JSONObjectWithData:data options:kNilOptions error:&error];
    NSLog(@"json: %@", json);
    
    NSDictionary* game = [json objectAtIndex:0];
    
    [ _gameButton setTitle: [NSString stringWithFormat:@"%@", [game objectForKey:@"name"]] forState: UIControlStateNormal];
    
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

/*
 #pragma mark - Navigation
 
 // In a storyboard-based application, you will often want to do a little preparation before navigation
 - (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
 // Get the new view controller using [segue destinationViewController].
 // Pass the selected object to the new view controller.
 }
 */

@end
